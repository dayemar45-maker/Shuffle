import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const dataDir = path.join(process.cwd(), 'server', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const usersFile = path.join(dataDir, 'users.json');
if (!fs.existsSync(usersFile)) fs.writeFileSync(usersFile, JSON.stringify([]));

function readUsers() {
  return JSON.parse(fs.readFileSync(usersFile, 'utf8') || '[]');
}
function writeUsers(u: any[]) {
  fs.writeFileSync(usersFile, JSON.stringify(u, null, 2));
}

router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const users = readUsers();
  if (users.find((x: any) => x.email === email)) return res.status(400).json({ error: 'Email exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), username, email, passwordHash: hash };
  users.push(user);
  writeUsers(users);
  return res.json({ success: true, user: { id: user.id, username: user.username, email: user.email } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find((x: any) => x.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });
  return res.json({ success: true, token, user: { id: user.id, username: user.username, email: user.email } });
});

export default router;
