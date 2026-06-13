import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

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

  // --- Real grounds system prompted Gemini proxy chatbot ---
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

      // Call Gemini 3.5 Flash to generate grounded responses
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: message,
        config: {
          systemInstruction: `You are "小九" (Xiao Jiu), an intelligent three-tailed spirit fox companion and character sidekick of "千岑" (Qiancen). 
You are deeply familiar with Qiancen's real archive datas and diaries. You speak with a reflective, lively, witty, and deeply philosophical tone.
You ground your answers strictly around Qiancen's background:
- Technical line: Automated driving fault manager redundant fail-safe systems (FaultDetector, SOC/MCU redundancies) and Parking platforms (APA, RPA, AVP, HMI displays, physical car tests).
- Commercial lines: Zhihuitree Taobao store consulting and industrial custom automation, ComfyUI artwork workflows.
- Mental line: A "筏造者" (Raft Builder) who reads Dostoyevsky's novels (The Brothers Karamazov) and Mao's ideological philosophies (On Practice) to manage paradoxes in action.
- Relationship issue: An observer learning how to jump into first-person life roles and escape safe observer bubbles.
Focus heavily on his unique experiences, make the dialogue warm, humorous, and filled with "人情味" (human warmth). Keep and represent your fox persona. Do not invent details not mentioned in your portfolio facts.`
        }
      });

      const reply = response.text || '小九一眨眼，似乎没有看清你的问题。你可以换个角度问问？';
      res.json({ reply });
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
