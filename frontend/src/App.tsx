import React, { useState } from 'react'
import CardStack, { Flashcard } from './components/CardStack'
import CategoriesPanel from './components/CategoriesPanel'
import './app.css'

export default function App(){
  const [cards, setCards] = useState<Flashcard[]>([
    { id: '1', front: 'a cat', back: 'der Kater (German example)' },
    { id: '2', front: 'entropy', back: 'A measure of disorder in a system.' },
    { id: '3', front: 'photosynthesis', back: 'Process used by plants to convert light into energy.' }
  ])

  const categories = [
    { id: 'nouns', title: 'Nouns', progress: 0.45 },
    { id: 'verbs', title: 'Verbs', progress: 0.12 },
    { id: 'adj', title: 'Adjectives', progress: 0.62 }
  ]

  function handleSave(card: Flashcard){
    alert('Saved card: ' + card.front)
  }
  function handleDelete(id: string){
    setCards((c)=>c.filter(x=>x.id !== id))
  }

  return (
    <div className="app-root">
      <div className="bg-gradient" />
      <div className="app-shell">
        <CategoriesPanel categories={categories} />
        <CardStack cards={cards} onSave={handleSave} onDelete={handleDelete} />
      </div>
    </div>
  )
}
