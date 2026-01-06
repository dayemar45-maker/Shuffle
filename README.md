# Cognitive Catalyst - Shuffle (Starter Scaffold)

This repository contains a starter scaffold for "Cognitive Catalyst" frontend and backend: a React + TypeScript frontend and a Node.js (Express) backend with a sample OCR -> flashcard route and UI components inspired by the UI image provided.

Quick setup (local)

Prerequisites: Node.js 18+, npm or yarn, Google Cloud or OpenAI API keys if you plan to enable OCR/LLM features.

1. Install frontend dependencies
   cd frontend
   npm install

2. Install server dependencies
   cd ../server
   npm install

3. Create environment file(s)
   - Copy server/.env.example -> server/.env and fill API keys (OPENAI_API_KEY, GOOGLE_APPLICATION_CREDENTIALS or VISION_API_KEY) and other placeholders.

4. Run frontend (development)
   cd frontend
   npm run dev

5. Run server (development)
   cd server
   npm run dev

Notes
- This scaffold includes a React component CardStack and CategoriesPanel to reproduce the UI style you provided.
- The backend includes a minimal Express route for OCR -> LLM flashcard generation; you must supply API keys and configure Google Cloud credentials.

License: MIT
