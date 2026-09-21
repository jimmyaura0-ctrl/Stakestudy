import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Endpoint to generate smart summary, key concepts, flashcards, or quiz questions
app.post('/api/notes/ai-assist', async (req, res) => {
  try {
    const { title, subject, content, action } = req.body;
    if (!content && !title) {
      return res.status(400).json({ error: 'Content or title is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured on the server. Falling back to local offline processor.',
        fallback: true,
      });
    }

    let prompt = '';
    if (action === 'summary') {
      prompt = `You are an expert academic study tutor. Analyze these study notes and generate:
1. An executive summary (3-4 concise paragraphs).
2. Key takeaways and essential formulas/definitions (bullet points).
3. Common exam pitfalls or tips to remember.

Title: ${title || 'Study Note'}
Subject: ${subject || 'Academic Subject'}
Content:
${content.slice(0, 15000)}

Please format the response in clean Markdown with clear section headers.`;
    } else if (action === 'flashcards') {
      prompt = `You are an expert academic tutor. From the following study notes, create 5-8 high-yield study flashcards for revision.
Return STRICTLY valid JSON with no markdown fences, matching this schema:
[
  {
    "front": "Clear question, prompt, or term",
    "back": "Concise, precise answer, formula, or definition"
  }
]

Title: ${title || 'Study Note'}
Subject: ${subject || 'Academic Subject'}
Content:
${content.slice(0, 15000)}`;
    } else if (action === 'quiz') {
      prompt = `You are an expert academic examiner. From these study notes, create 4 multiple-choice practice quiz questions.
Return STRICTLY valid JSON with no markdown fences, matching this schema:
[
  {
    "question": "Question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answerIndex": 0,
    "explanation": "Brief explanation why this is correct"
  }
]

Title: ${title || 'Study Note'}
Subject: ${subject || 'Academic Subject'}
Content:
${content.slice(0, 15000)}`;
    } else {
      prompt = `Review and organize these study notes into clean, structured study points with key highlights:
Title: ${title}
Subject: ${subject}
Content: ${content.slice(0, 15000)}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const textOutput = response.text || '';
    res.json({ result: textOutput });
  } catch (err: any) {
    console.error('Error generating AI study assistance:', err);
    res.status(500).json({ error: err.message || 'Failed to process note with AI' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
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
    console.log(`Study Notes Hub server running on port ${PORT}`);
  });
}

startServer();
