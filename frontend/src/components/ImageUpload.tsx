import React, { useState } from 'react';
import axios from 'axios';
import CardStack, { Flashcard } from './CardStack';
import Quiz from './Quiz';

export default function ImageUpload(){
  const [file, setFile] = useState<File | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleUpload(){
    if(!file) return;
    setLoading(true);
    try{
      const form = new FormData();
      form.append('image', file);
      const resp = await axios.post('/api/ai/upload-and-ocr', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      const c = resp.data.cards || [];
      setCards(c.map((x:any, i:number)=>({ id: String(i), front: x.front, back: x.back })));
    }catch(e){
      console.error(e);
      alert('Upload failed');
    }finally{ setLoading(false); }
  }

  async function saveCard(card: Flashcard){
    try{
      const token = localStorage.getItem('token');
      await axios.post('/api/cards', { front: card.front, back: card.back }, { headers: { Authorization: token ? `Bearer ${token}` : '' } });
      alert('Saved');
    }catch(e){ console.error(e); alert('Save failed'); }
  }

  return (
    <div>
      <h3>Upload Image</h3>
      <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0] ?? null)} />
      <button onClick={handleUpload} disabled={!file || loading}>{loading? 'Processing...': 'Upload & Generate'}</button>
      <div style={{ marginTop: 20 }}>
        <CardStack cards={cards} onSave={saveCard} />
      </div>
      <div style={{ marginTop: 30 }}>
        <Quiz cards={cards} />
      </div>
    </div>
  )
}
