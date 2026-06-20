import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

import fs from 'fs';

import {
  buildSystemInstruction,
  pickFallback,
  XIAOJIU_EMPTY_REPLY,
} from './src/lib/xiaojiu';

dotenv.config();

// 方舟平台（Ark）OpenAI 兼容接口配置。
// 优先读 ARK_API_KEY / ARK_MODEL，回退到 GEMINI_API_KEY 占位兼容旧 .env。
const ARK_API_KEY = process.env.ARK_API_KEY || process.env.GEMINI_API_KEY || '';
const ARK_BASE_URL = process.env.ARK_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3';
const ARK_MODEL = process.env.ARK_MODEL || 'glm-4-5-air-20250728';

// Helper to recursively list markdown files in the workspace's Obsidian vault
function getMarkdownFiles(dir: string): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getMarkdownFiles(fullPath));
    } else if (file.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Simple but efficient keyword-based RAG search on the vault
function searchVault(query: string): { path: string; title: string; content: string; score: number }[] {
  const vaultDir = path.join(process.cwd(), 'RPG_extracted', '随机打开的RPG');
  const files = getMarkdownFiles(vaultDir);
  const matched: { path: string; title: string; content: string; score: number }[] = [];
  
  const cleanQuery = query.replace(/[^\w\s\u4e00-\u9fa5]/gi, ' ').trim();
  const queryWords = cleanQuery.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  if (queryWords.length === 0) return [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      const lowerContent = content.toLowerCase();
      let score = 0;
      
      // Basic scoring of word / keyword matches
      for (const word of queryWords) {
        let index = 0;
        while ((index = lowerContent.indexOf(word, index)) !== -1) {
          score += 1;
          index += word.length;
        }
      }
      
      if (score > 0) {
        const relativePath = path.relative(vaultDir, file);
        matched.push({
          path: relativePath,
          title: path.basename(file, '.md'),
          content: content.substring(0, 1500), // Pull initial chunk
          score
        });
      }
    } catch (e) {
      // Continue on file reading errors
    }
  }
  
  return matched.sort((a, b) => b.score - a.score).slice(0, 5);
}

// 调用方舟 OpenAI 兼容接口（chat/completions）。
// 不引入 openai SDK，直接 fetch —— 零新依赖，bundle 更小。
async function callArk(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]): Promise<string> {
  const resp = await fetch(`${ARK_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ARK_API_KEY}`,
    },
    body: JSON.stringify({
      model: ARK_MODEL,
      messages,
      temperature: 0.85,
      stream: false,
    }),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => '');
    throw new Error(`Ark API ${resp.status}: ${errText.slice(0, 300)}`);
  }

  const data: any = await resp.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content === 'string' && content.trim()) return content.trim();
  throw new Error('Ark API: empty content');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // --- Dynamic Obsidian Vault Navigation APIs ---
  app.get('/api/vault/files', (req, res) => {
    try {
      const vaultDir = path.join(process.cwd(), 'RPG_extracted', '随机打开的RPG');
      if (!fs.existsSync(vaultDir)) {
        return res.json({ files: [] });
      }
      const files = getMarkdownFiles(vaultDir);
      const relativeFiles = files.map(file => {
        const relPath = path.relative(vaultDir, file);
        const parts = relPath.split(path.sep);
        return {
          relativePath: relPath.replace(/\\/g, '/'),
          title: path.basename(file, '.md'),
          categories: parts.slice(0, -1),
          size: fs.statSync(file).size
        };
      });
      res.json({ files: relativeFiles });
    } catch (err) {
      console.error('Error listing files in vault:', err);
      res.status(500).json({ error: 'Failed to retrieve vault files' });
    }
  });

  app.get('/api/vault/read', (req, res) => {
    try {
      const relativePath = req.query.path as string;
      if (!relativePath) {
        return res.status(400).json({ error: 'File path query param is required' });
      }
      const vaultDir = path.join(process.cwd(), 'RPG_extracted', '随机打开的RPG');
      const safePath = path.resolve(vaultDir, relativePath);
      
      // Enforce path traversal safety
      if (!safePath.startsWith(vaultDir)) {
        return res.status(403).json({ error: 'Access Denied: Path outside of Obsidian Vault' });
      }

      if (!fs.existsSync(safePath)) {
        return res.status(444).json({ error: 'File not found' });
      }

      const content = fs.readFileSync(safePath, 'utf-8');
      res.json({ content });
    } catch (err) {
      console.error('Error reading vault file:', err);
      res.status(500).json({ error: 'Failed to read file content' });
    }
  });

  // --- Real grounds system prompted Gemini proxy chatbot with live RAG ---
  app.post('/api/chat', async (req, res) => {
    let searchResults: { path: string; title: string; content: string; score: number }[] = [];
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message input is required' });
      }

      // Search Obsidian files for dynamic RAG background grounding
      try {
        searchResults = searchVault(message);
      } catch (searchErr) {
        console.warn('Search vault failed, proceeding without search results:', searchErr);
      }

      const systemInstruction = buildSystemInstruction(searchResults);

      let reply = '';

      // 方舟 key 未配置时直接走离线兜底
      const hasApiKey = ARK_API_KEY && ARK_API_KEY !== 'MY_GEMINI_API_KEY' && ARK_API_KEY.trim() !== '';

      if (hasApiKey) {
        // 方舟 OpenAI 兼容接口，带 1 次重试
        let lastError: any = null;
        let success = false;
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            reply = await callArk([
              { role: 'system', content: systemInstruction },
              { role: 'user', content: message },
            ]);
            success = true;
            break;
          } catch (err: any) {
            lastError = err;
            console.warn(`[Ark Retry] attempt ${attempt} failed:`, err?.message || err);
            await new Promise((resolve) => setTimeout(resolve, attempt * 200));
          }
        }

        if (!success && lastError) {
          console.error('Ark API failed, triggering offline fallback.', lastError);
          throw lastError;
        }
      } else {
        console.warn('ARK_API_KEY is not configured. Using offline RAG-guided rule backup.');
        throw new Error('API_KEY_MISSING');
      }

      if (!reply) {
        reply = XIAOJIU_EMPTY_REPLY;
      }

      res.json({ reply, text: reply, matches: searchResults.map(r => r.title) });

    } catch (err: any) {
      console.warn('Chat error caught, deploying offline fallback:', err?.message || err);

      const fallbackText = pickFallback(req.body.message || '');

      res.json({
        reply: fallbackText,
        text: fallbackText,
        matches: searchResults ? searchResults.map(r => r.title) : []
      });
    }
  });

  // Serve static assets and bundle React components seamlessly
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is booting live on port ${PORT}`);
  });
}

startServer();
