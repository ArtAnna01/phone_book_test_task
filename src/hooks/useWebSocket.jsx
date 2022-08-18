import { useEffect, useRef, useState } from "react";

export const useWebSocket = () => {
  const ws = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:5000");

    ws.current.onopen = () => {
      console.log("Connected");
    };

    ws.current.onmessage = (event) => {
      console.log(JSON.parse(event.data));
      setData(JSON.parse(event.data));
    };

    ws.current.onclose = () => {
      console.log("Connection closed");
    };

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, []);

  return { data };
};
