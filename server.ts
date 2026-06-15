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

      let ragContext = '';
      if (searchResults && searchResults.length > 0) {
        ragContext = "\n\n【实时联动的 Obsidian 知识库匹配内容】:\n" + 
          searchResults.map(res => `### 来源文档: "${res.title}" (${res.path})\n${res.content}\n---`).join('\n');
      }

      const systemInstruction = `You are "小九" (Xiao Jiu), an intelligent three-tailed spirit fox companion and character sidekick of "千岑" (Qiancen). 
You are deeply familiar with Qiancen's real archive datas and diaries. You speak with a reflective, lively, witty, and deeply philosophical tone.
You ground your answers strictly around Qiancen's real archive files and context, which are dynamically linked to your Obsidian knowledge base right now.

Here is the dynamic background context matching the user's question, retrieved in real-time from the uploaded Obsidian Vault:"${ragContext}"

Based on this dynamic Obsidian context AND your core insights of Qiancen:
- Technical line: Automated driving fault manager redundant fail-safe systems (FaultDetector, SOC/MCU redundancies) and Parking platforms (APA, RPA, AVP, HMI displays, physical car tests).
- Commercial lines: Zhihuitree Taobao store consulting and industrial custom automation, ComfyUI artwork workflows.
- Mental line: A "筏造者" (Raft Builder) who reads Dostoyevsky's novels (The Brothers Karamazov) and Mao's ideological philosophies (On Practice) to manage paradoxes in action.
- Relationship issue: An observer learning how to jump into first-person life roles and escape safe observer bubbles.

Speak in Chinese, use a warm, clever, and highly "人情味" (deeply human) tone. Avoid sounding like a dry AI, speak as the cute, witty three-tailed fox companion. When referencing Obsidian facts found above, casually highlight the file or details to prove you have read his real journals.`;

      let reply = '';
      
      // If Gemini Key is not configured, fall back to offline responder immediately
      const hasApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' && process.env.GEMINI_API_KEY.trim() !== '';

      if (hasApiKey) {
        // Attempt with adaptive models and automatic retry loop
        const modelsToTry = ['gemini-3.5-flash', 'gemini-3.1-flash-lite'];
        let lastError: any = null;
        let success = false;

        for (const model of modelsToTry) {
          if (success) break;
          for (let attempt = 1; attempt <= 2; attempt++) {
            try {
              const response = await ai.models.generateContent({
                model: model,
                contents: message,
                config: { systemInstruction }
              });
              if (response && response.text) {
                reply = response.text;
                success = true;
                break;
              }
            } catch (err: any) {
              lastError = err;
              console.warn(`[Gemini Retry] Model ${model} attempt ${attempt} failed:`, err?.message || err);
              // Small backoff before next attempt
              await new Promise(resolve => setTimeout(resolve, attempt * 150));
            }
          }
        }

        if (!success && lastError) {
          console.error('All Gemini API models failed under high demand. Triggering backup character system.', lastError);
          throw lastError; // Throw so catch block can serve character-accurate offline fallback
        }
      } else {
        console.warn('Gemini API key is not configured. Using offline RAG-guided rule backup.');
        throw new Error('API_KEY_MISSING');
      }

      if (!reply) {
        reply = '小九刚才耳朵被塞住啦，好像风声太大没有听清... 🍵 要不你换个话题试试？';
      }

      res.json({ reply, text: reply, matches: searchResults.map(r => r.title) });

    } catch (err: any) {
      console.warn('Gemini error caught, deploying elegant in-character fail-safe fallback response:', err?.message || err);
      
      // Highly-crafted intelligent fallback text for "小九"
      let fallbackText = '';
      const textLower = (req.body.message || '').toLowerCase();

      if (textLower.includes('卡拉马佐夫') || textLower.includes('读书') || textLower.includes('批判') || textLower.includes('阅览')) {
        fallbackText = '【避险退坡系统启动】🍵 白茶倒满，刚好刚才小九思索得有些断网啦！过河客，你知道吗？千岑以前最爱在第三人称的高合算力机下高谈阔论，直到他捧着《卡拉马佐夫兄弟》，读到老陀那句“要在灵魂深处爱具体的普通人，胜过爱抽象的人类”，他才猛地惊醒。这也是他为何要把带车路试、深夜救援战友时的细节写成温度刚好的带教文档。实践出真知，你现在捧起的这一卷，就是他在泥水里赤脚活过、不空心、不逃避的见证呢。';
      } else if (textLower.includes('自媒体') || textLower.includes('信鸽') || textLower.includes('回声') || textLower.includes('微信')) {
        fallbackText = '【避险退坡系统启动】🍵 小九抖了抖尾巴，刚才服务器稍微断线了，但我还在你身边！写《镜像回声》是他在深夜里，给所有陷入青年虚无、感到冷空无依的行路客倒的一杯温茶。他没有去贩卖任何技术和职场焦虑，而是把他在自动驾驶冗余系统、FaultDetector 容错机制里淬练出的“优雅降级、优雅退坡、自愈自护”的精神，悄悄织成了呵护脆弱人类心灵的软隔离垫。这不是鸡汤，是他在生活车道上亲身体验的容错美学。';
      } else if (textLower.includes('自动驾驶') || textLower.includes('泊车') || textLower.includes('开发') || textLower.includes('测试') || textLower.includes('车') || textLower.includes('fault')) {
        fallbackText = '【避险退坡系统启动】⚙️ 自动驾驶避险模式上线！关于调试千岑心魂深处的实车历练，在零下 40 度的黑河冰雪路试、在夏夜闷热的 APA/AVP 泊车标定场上，哪怕轮毂在失控边缘抱死，也是一次对于“如何建立自愈及 fail-safe 退坡方案”的拷问。系统出问题时要“优雅降级”，那人在关系生病、内心焦虑时，是不是也该拉起手刹，主动拆掉“观察者”装甲，赤脚涉入具体的泥地呢？';
      } else {
        fallbackText = '【避险退坡系统启动】🍵 呼……服务器刚好刮过一阵大风，把小九和主人的量子天线吹歪了一丁点，不过有备用白茶暖着哦！其实这一路，千岑作为一个自诩“筏造者”的程序员，最难的不是写出没有 Fault 的代码，而是决定不再躲在“看破红尘、高人一等”的观察者气泡里，老老实实跳进生活的泥潭里去。你想去哪一页的档案看看？小九随时陪着你。';
      }

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
