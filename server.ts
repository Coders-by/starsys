import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

import fs from 'fs';

dotenv.config();

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

// Standard initialization of the google/genai client with proper User-Agent headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

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
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message input is required' });
      }

      // If Gemini Key is not configured, fall back immediately to let client handle locally
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'MY_GEMINI_API_KEY') {
        return res.status(503).json({ error: 'Gemini API key is not configured' });
      }

      // Search Obsidian files for dynamic RAG background grounding
      const searchResults = searchVault(message);
      let ragContext = '';
      if (searchResults.length > 0) {
        ragContext = "\n\n【实时联动的 Obsidian 知识库匹配内容】:\n" + 
          searchResults.map(res => `### 来源文档: "${res.title}" (${res.path})\n${res.content}\n---`).join('\n');
      }

      // Call Gemini 3.5 Flash to generate grounded responses
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: message,
        config: {
          systemInstruction: `You are "小九" (Xiao Jiu), an intelligent three-tailed spirit fox companion and character sidekick of "千岑" (Qiancen). 
You are deeply familiar with Qiancen's real archive datas and diaries. You speak with a reflective, lively, witty, and deeply philosophical tone.
You ground your answers strictly around Qiancen's real archive files and context, which are dynamically linked to your Obsidian knowledge base right now.

Here is the dynamic background context matching the user's question, retrieved in real-time from the uploaded Obsidian Vault:"${ragContext}"

Based on this dynamic Obsidian context AND your core insights of Qiancen:
- Technical line: Automated driving fault manager redundant fail-safe systems (FaultDetector, SOC/MCU redundancies) and Parking platforms (APA, RPA, AVP, HMI displays, physical car tests).
- Commercial lines: Zhihuitree Taobao store consulting and industrial custom automation, ComfyUI artwork workflows.
- Mental line: A "筏造者" (Raft Builder) who reads Dostoyevsky's novels (The Brothers Karamazov) and Mao's ideological philosophies (On Practice) to manage paradoxes in action.
- Relationship issue: An observer learning how to jump into first-person life roles and escape safe observer bubbles.

Speak in Chinese, use a warm, clever, and highly "人情味" (deeply human) tone. Avoid sounding like a dry AI, speak as the cute, witty three-tailed fox companion. When referencing Obsidian facts found above, casually highlight the file or details to prove you have read his real journals.`
        }
      });

      const reply = response.text || '小九一眨眼，似乎没有看清你的问题。你可以换个角度问问？';
      res.json({ reply, matches: searchResults.map(r => r.title) });
    } catch (err: any) {
      console.error('Gemini proxy error:', err);
      res.status(500).json({ error: 'Internal chatbot dispatch error' });
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
