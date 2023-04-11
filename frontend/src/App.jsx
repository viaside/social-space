import React, { useEffect, useState } from "react";
import { Route, Routes,  BrowserRouter} from 'react-router-dom';
import AppRoutes from './AppRoutes';
import NavBar from './component/NavBar';
import './App.css';
import getMessage from "./features/getMessage";
import { useSelector, useDispatch } from 'react-redux';
import { set } from './features/redux/dataSlice';

export default function App() {
  const dispatch = useDispatch()
  const dataRedux = useSelector((state) => state.data.value);
  let [newChatCount, setChatCount] = useState(0);
  let [newGroupCount, setGroupCount] = useState(0);
  
  useEffect(() => {
    const websocket = new WebSocket('wss://localhost:8443/api/webhook/connect');
    
    getMessage().then(async (result) => await dispatch(set(result)));

    websocket.onopen = () => {
      console.log('connected');
    }
    
    websocket.onmessage = () => {
      getMessage().then(async (result) => await dispatch(set(result))
      );
    }
  }, []);

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
          {AppRoutes.map((route, index) => {
            const { element, ...rest } = route;
            return <Route key={index} {...rest} element={element} />;
          })}
      </Routes>
    </BrowserRouter>
  );
}