import express from 'express';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Save a card (requires auth middleware to set req.userId)
router.post('/', (req: any, res) => {
  const userId = req.userId; // set by auth middleware
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { front, back, language, tags } = req.body;
  const id = uuidv4();
  const createdAt = Date.now();
  db.prepare('INSERT INTO cards (id, userId, front, back, language, tags, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(id, userId, front, back, language || 'en', JSON.stringify(tags || []), createdAt);
  return res.json({ success: true, card: { id, front, back, language, tags, createdAt } });
});

// List cards for user
router.get('/', (req: any, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const rows = db.prepare('SELECT * FROM cards WHERE userId = ? ORDER BY createdAt DESC').all(userId);
  const cards = rows.map((r: any) => ({ id: r.id, front: r.front, back: r.back, language: r.language, tags: JSON.parse(r.tags || '[]'), createdAt: r.createdAt }));
  return res.json({ success: true, cards });
});

export default router;
