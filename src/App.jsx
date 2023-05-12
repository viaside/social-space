import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from 'react-redux'
import { getMessageAsync } from './redux/slice/messageSlice';

import "./App.css"

function App() {
  //redux 
  const Message = useSelector((state) => state.Message.data);
  const dispatch = useDispatch()

  return (
    <>
    { Message.map(element => {
      return <p>{element.text}</p>
    }) }
    
    <button onClick={async () => { dispatch(getMessageAsync()) }}>Загрузить</button>
    </>
  );
}

export default App;
