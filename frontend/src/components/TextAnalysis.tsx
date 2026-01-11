import React, { useState } from 'react';
import axios from 'axios';
import CardStack, { Flashcard } from './CardStack';
import Quiz from './Quiz';

export default function TextAnalysis(){
  const [text, setText] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);

  async function analyze(){
    if(!text) return;
    setLoading(true);
    try{
      const resp = await axios.post('/api/ai/text-to-cards', { text });
      const c = resp.data.cards || [];
      setCards(c.map((x:any,i:number)=>({ id: String(i), front: x.front, back: x.back })));
    }catch(e){ console.error(e); alert('Analysis failed') }finally{ setLoading(false) }
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
      <h3>Text Analysis</h3>
      <textarea value={text} onChange={(e)=>setText(e.target.value)} rows={8} style={{ width: '100%' }} />
      <button onClick={analyze} disabled={loading}>{loading? 'Analyzing...':'Analyze Text'}</button>
      <div style={{ marginTop: 20 }}>
        <CardStack cards={cards} onSave={saveCard} />
      </div>
      <div style={{ marginTop: 30 }}>
        <Quiz cards={cards} />
      </div>
    </div>
  )
}
