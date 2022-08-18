import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './../App.css';
import {DebounceInput} from 'react-debounce-input';

function Chat({name}) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(socket?.connected);
  const [chatData, setChatData] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [joinedUser, setJoinedUser] = useState('');
  const [onTypingUsers, setOnTypingUsers] = useState([]);
  const isTyping = useRef(false);
  const isEmpty = useRef(false);


  socket?.on('chat', (data) => {
    const updatedChats= [...chatData];
    updatedChats.push(data);
    setChatData(updatedChats);
  });

  socket?.on('joinChat', (data) => {
    handleJoinee(data);
  });

  socket?.on('typing', (data) => {
    handleTypees(data);
  });

  const handleTypees = (data) => {
    const temp = [...onTypingUsers];
    let find = false;    
    let index = 0;
    temp.forEach((user, index)=>{
        if(user?.user === data.user){
            find = true;
            index= index;
        }
    })
    if(data?.typing){
        if(!find){
            temp.push(data);
            setOnTypingUsers(temp);
        }
    }else{
        if(find){
            temp.splice(index,1);
            setOnTypingUsers(temp);
        }
    }
    }

  const handleJoinee = (name) => {
    setJoinedUser(name);
    setTimeout(() =>{
        setJoinedUser('');
    },3000);
  }

  const sendMessage = () => {
    if(inputVal !== ''){
        socket?.emit('chat', {message: inputVal, user: name});
        socket?.emit('typing', {user: name, typing: false});
        isEmpty.current = true;
        isTyping.current = false;
        setInputVal('');
    }
  }

  const handleChange = (value) => {
    if(value !== ''){
        if(!isTyping.current){
            socket?.emit('typing', {user: name, typing: true});
            isTyping.current = true;
            isEmpty.current = false;
        }
    }else{
        if(!isEmpty.current){
            socket?.emit('typing', {user: name, typing: false});
            isEmpty.current = true;
            isTyping.current = false;
        }
    }
    setInputVal(value);
  };

  const getTypingUsers = ()=>{
    const names = onTypingUsers?.map((user)=>user?.user);
    return names?.join(', ');
  }

  useEffect(()=>{
    const socketInstance = io('http://192.168.18.239:8080');
    setSocket(socketInstance);
  },[])

  useEffect(() => {
    if(socket){
      socket?.on('connect', () => {
        socket?.emit('joinChat',name);
        setIsConnected(true);
    });

    socket?.on('disconnect', (reason) => {
      console.log('disconnect',reason);
      setIsConnected(false);
    });

    return () => {
      socket?.off('connect');
      socket?.off('disconnect');
      socket?.off('chat');
      socket?.off('joinChat');
    };
  }
  }, [socket]);


  return (
    <div className='chatContainer'>
        {
            joinedUser?.length > 0 ? <div className='notification'>{joinedUser} joined the chat!</div> : null
        }
      <p>Connected: { '' + isConnected }</p>
      <div className='chatBody'>
        {
          chatData?.map((data, index)=>{
            return <div key={index} className='chatTile'>
              {data?.message}
              <div className='tileName'>{data?.user}</div>
            </div>
          })
        }
      </div>
      <div className='footer'>
        {/* <input value={inputVal} onChange={(e)=>handleChange(e?.target?.value)}></input> */}
        <DebounceInput
          debounceTimeout={300}
          value={inputVal}
          onChange={event => handleChange(event.target.value)} />
        <div onClick={sendMessage}>Send</div>
      </div>
      {
        onTypingUsers?.length > 0 ? (
            <div>{getTypingUsers()} typing...</div>
        ) 
        : null
      }
    </div>
  );
}

export default Chat;
