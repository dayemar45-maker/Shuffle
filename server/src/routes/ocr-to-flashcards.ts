import express from 'express';
import { createWorker } from 'tesseract.js';
import nlp from 'compromise';
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(process.cwd(), 'server', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({ dest: uploadDir });

// Simple template-based definition generator
function generateDefinition(term: string, contextText: string) {
  const sentences = contextText.split(/(?<=[.?!])\s+/);
  const lower = term.toLowerCase();
  const found = sentences.find((s) => s.toLowerCase().includes(lower));
  if (found) {
    return found.trim().replace(/\s+/g, ' ').slice(0, 400);
  }
  return `${term} — key concept from the provided text. (Review source sentence for full context.)`;
}

// Extract candidate terms (nouns/noun-phrases) using compromise
function extractTerms(text: string, max = 25) {
  const doc = nlp(text);
  const nouns = doc.nouns().out('array');
  const phrases = doc.nouns().terms().out('array');
  const candidates = nouns.concat(phrases).map((s) => s.trim()).filter(Boolean);
  const uniq = Array.from(new Set(candidates)).slice(0, max);
  return uniq;
}

async function runOCR(imagePath: string) {
  const worker = createWorker({ logger: (m) => {} });
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data } = await worker.recognize(imagePath);
  await worker.terminate();
  return data.text || '';
}

router.post('/upload-and-ocr', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Missing image file' });

    const imagePath = req.file.path;
    const ocrText = await runOCR(imagePath);

    const cleaned = ocrText.replace(/\s{2,}/g, ' ').trim();

    const terms = extractTerms(cleaned, 40);

    const cards = terms.map((t) => ({
      front: t,
      back: generateDefinition(t, cleaned),
      confidence: 0.6,
      tags: [],
    }));

    return res.json({ success: true, cards, rawText: cleaned, uploaded: req.file.filename });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
