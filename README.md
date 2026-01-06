# Cognitive Catalyst - Shuffle (Starter Scaffold)

This repository contains a starter scaffold for "Cognitive Catalyst" frontend and backend with a free, self-hosted stack option. The server uses Tesseract OCR and open-source NLP to generate flashcards from images without paid cloud APIs.

Free stack highlights
- OCR: tesseract.js (runs locally on the server)
- NLP / term extraction: compromise
- Auth: optional local username/email + password with bcrypt + JWT (file-based store)
- Storage: uploaded images saved to server/uploads
- Database: simple file-based JSON store (server/data) or swap to SQLite later

Local setup (no paid APIs required)
1. Clone the repo
   git clone https://github.com/dayemar45-maker/Shuffle
   cd Shuffle

2. Install frontend
   cd frontend
   npm install
   npm run dev

3. Install server
   cd ../server
   npm install
   copy server/.env.example to server/.env and set JWT_SECRET if you plan to use auth
   npm run dev

4. Use the OCR endpoint
   - POST multipart/form-data to http://localhost:4000/api/ai/upload-and-ocr with field `image` set to a file
   - The server will return generated flashcards and the OCR raw text

Security note
- This scaffold stores user data in files for simplicity. For production, migrate to a proper database (SQLite/Postgres) and secure file storage.
