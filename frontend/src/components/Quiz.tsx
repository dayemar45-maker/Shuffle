import React, { useState } from 'react';
import { Flashcard } from './CardStack';

export default function Quiz({ cards }: { cards: Flashcard[] }){
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);

  React.useEffect(()=>{ if(cards.length) startQuiz(); }, [cards]);

  function startQuiz(){
    setIndex(0); setScore(0); setFinished(false); setSelected(null);
    generateChoices(0);
  }

  function generateChoices(i:number){
    const correct = cards[i]?.back || '';
    const other = cards.filter((_,idx)=>idx!==i).map(c=>c.back || '');
    const shuffled = other.sort(()=>0.5 - Math.random()).slice(0,3);
    const opts = [correct, ...shuffled].sort(()=>0.5 - Math.random());
    setChoices(opts);
    setSelected(null);
  }

  function submit(){
    if(selected == null) return;
    const correct = cards[index].back;
    if(selected === correct) setScore(s=>s+1);
    const next = index+1;
    if(next >= cards.length){ setFinished(true); }
    else { setIndex(next); generateChoices(next); }
  }

  if(cards.length === 0) return <div>No cards to quiz.</div>;
  if(finished) return <div>Quiz finished! Score: {score}/{cards.length} <button onClick={startQuiz}>Retry</button></div>

  return (
    <div>
      <h3>Quiz</h3>
      <div><strong>Q {index+1} / {cards.length}</strong></div>
      <div style={{ marginTop:12, marginBottom:12, fontSize:20 }}>{cards[index].front}</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {choices.map((c,idx)=> (
          <button key={idx} onClick={()=>setSelected(c)} style={{ background: selected===c ? '#6c42ff' : '#fff', color: selected===c ? '#fff': '#000' }}>{c}</button>
        ))}
      </div>
      <div style={{ marginTop:12 }}><button onClick={submit}>Submit</button></div>
    </div>
  )
}
