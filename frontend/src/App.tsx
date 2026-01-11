import React from 'react';
import ImageUpload from './components/ImageUpload';
import TextAnalysis from './components/TextAnalysis';
import SavedCards from './components/SavedCards';
import './styles.css';

function Login(){
  const [email,setEmail]=React.useState('');
  const [password,setPassword]=React.useState('');
  async function doLogin(){
    try{
      const resp = await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password})});
      const j = await resp.json();
      if(j?.token){ localStorage.setItem('token', j.token); alert('Logged in'); }
      else alert('Login failed');
    }catch(e){ console.error(e); alert('Login error'); }
  }
  return (
    <div>
      <h3>Login</h3>
      <input placeholder='email' value={email} onChange={(e)=>setEmail(e.target.value)} />
      <input placeholder='password' type='password' value={password} onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={doLogin}>Login</button>
    </div>
  )
}

export default function App(){
  const [route, setRoute] = React.useState('home');

  return (
    <div className="app-root">
      <div className="bg-gradient" />
      <div style={{ width: 1000, margin: '24px auto' }}>
        <nav style={{ display:'flex', gap:12, marginBottom:20 }}>
          <button onClick={()=>setRoute('upload')}>Upload Image</button>
          <button onClick={()=>setRoute('text')}>Text Analysis</button>
          <button onClick={()=>setRoute('saved')}>Saved Cards</button>
          <button onClick={()=>setRoute('home')}>Home</button>
          <button onClick={()=>setRoute('login')}>Login</button>
        </nav>

        {route === 'home' && <div>Welcome to Shuffle - Cognitive Catalyst. Use the buttons above to upload images, analyze text, or view saved cards.</div>}
        {route === 'upload' && <ImageUpload />}
        {route === 'text' && <TextAnalysis />}
        {route === 'saved' && <SavedCards />}
        {route === 'login' && <Login />}
      </div>
    </div>
  )
}
