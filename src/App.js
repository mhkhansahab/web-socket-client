import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Home from './components/home';
import Chat from './components/chat';

function App() {
  const ref = useRef();
  const [name, setName]= useState('');

  const handleNext = ()=>{
    const value = ref.current?.value;
    if(value !== ''){
      setName(value);
    }
  }

  return (
    <div className='container'>
      {
        name?.length === 0 ? 
        (<Home onClick={handleNext} nameRef={ref}/>) 
        : 
        (<Chat name={name}/>)
      }
    </div>
  );
}

export default App;
