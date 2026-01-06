import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import ocrRoute from './routes/ocr-to-flashcards';
import authRoute from './routes/auth';

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve uploads directory for previewing images
app.use('/uploads', express.static(path.join(process.cwd(), 'server', 'uploads')));

app.use('/api/auth', authRoute);
app.use('/api/ai', ocrRoute);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
