import React from 'react';
import './../App.css';

export default function Home({onClick, nameRef}) {
  return (
    <div className='homeContainer'>
        <div className='name'>Enter Your Nickname</div>
        <input type="text" placeholder='Rocky' ref={nameRef}></input>
        <div onClick={onClick} className='button'>Next</div>
    </div>
  )
}
