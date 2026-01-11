import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardStack, { Flashcard } from './CardStack';

export default function SavedCards(){
  const [cards, setCards] = useState<Flashcard[]>([]);

  useEffect(()=>{ fetchCards() }, []);

  async function fetchCards(){
    try{
      const token = localStorage.getItem('token');
      const resp = await axios.get('/api/cards', { headers: { Authorization: token ? `Bearer ${token}` : '' } });
      const c = resp.data.cards || [];
      setCards(c.map((x:any)=>({ id: x.id, front: x.front, back: x.back })));
    }catch(e){ console.error(e) }
  }

  return (
    <div>
      <h3>Saved Cards</h3>
      <CardStack cards={cards} />
    </div>
  )
}
