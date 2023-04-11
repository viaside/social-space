import getMessage from "./getMessage";
import * as React from 'react';

const ServiceWebSocket = () => {
  React.useEffect(() => {
    const websocket = new WebSocket('wss://echo.websocket.org/');

    websocket.onopen = () => {
      console.log('connected');
    }

    websocket.onmessage = (event) => {
      getMessage();
    }
  
  }, [])
}
export default ServiceWebSocket;