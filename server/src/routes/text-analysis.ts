import express from 'express';
import nlp from 'compromise';

const router = express.Router();

function generateDefinition(term: string, contextText: string) {
  const sentences = contextText.split(/(?<=[.?!])\s+/);
  const lower = term.toLowerCase();
  const found = sentences.find((s) => s.toLowerCase().includes(lower));
  if (found) return found.trim().replace(/\s+/g, ' ').slice(0, 400);
  return `${term} — key concept from the provided text.`;
}

function extractTerms(text: string, max = 25) {
  const doc = nlp(text);
  const nouns = doc.nouns().out('array');
  const candidates = nouns.map(s => s.trim()).filter(Boolean);
  const uniq = Array.from(new Set(candidates)).slice(0, max);
  return uniq;
}

router.post('/text-to-cards', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false, error: 'Missing text' });
  const cleaned = text.replace(/\s{2,}/g, ' ').trim();
  const terms = extractTerms(cleaned, 40);
  const cards = terms.map(t => ({ front: t, back: generateDefinition(t, cleaned), confidence: 0.6, tags: [] }));
  return res.json({ success: true, cards, rawText: cleaned });
});

export default router;
