import React, { useEffect, createContext, useState } from 'react';
import axios from 'axios';
import cfg from "./../config.json"

export const DispatcherStatusContext = createContext();

export const DispatcherStatusProvider = ({ children }) => {
  const [dispatcherStatus, setDispatcherStatus] = useState({running: false, pending: 0, served: 0, deleted_tokens: 0, pending_orders: Array(0)});

  async function __worker() {
    try {
      fetch(cfg.DISPATCHER_URL+"/status").then((r) => r.json().then((a)=>{console.log("Worker Response ",a)
        setDispatcherStatus(a)
      }))
    } catch (error) {
      console.error("Worker error:", error);
    }
  }

  useEffect(() => {
    __worker();
    const intervalId = setInterval(__worker, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <DispatcherStatusContext.Provider value={dispatcherStatus}>
      {children}
    </DispatcherStatusContext.Provider>
  );
};