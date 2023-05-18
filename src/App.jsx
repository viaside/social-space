import React, { useEffect } from "react";
import { Route, Routes,  BrowserRouter} from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { getMessageAsync } from './redux/slice/messageSlice.js';
import AppRoutes from "./AppRoutes.js";
import Navbar from "./component/Navbar.jsx";

import "./App.css"

function App() {
  //redux 
  // const Message = useSelector((state) => state.Message.data);
  const dispatch = useDispatch();

  // load message to redux state
  dispatch(getMessageAsync());

  
  useEffect(() => {
    // connect/subscribe to backend websocket
    const websocket = new WebSocket('wss://localhost:8443/api/webhook/connect');

    // when joining
    websocket.onopen = () => {
      dispatch(getMessageAsync());
    }
    
    // when update message
    websocket.onmessage = () => {
      dispatch(getMessageAsync());
    }
  }, []);

  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        {AppRoutes.map((route, index) => {
          const { element, ...rest } = route;
          return <Route key={index} {...rest} element={element} />;
        })}
      </Routes>
    </BrowserRouter>    
  );
}

export default App;
