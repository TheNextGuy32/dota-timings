"use client";
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { TIMINGS } from './DotaTimings';
const TimingContext = createContext();

export const useTimingContext = () => {
  const context = useContext(TimingContext);
  if (!context) {
    throw new Error('useTimingContext must be used within a TimingProvider');
  }
  return context;
};

export const TimingProvider = ({ children }) => {
  // Timer state
  const [seconds, setSeconds] = useState(-20);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  // Enabled timings state
  const [enabledTimings, setEnabledTimings] = useState({
    ...Object.fromEntries(Object.entries(TIMINGS).map(([key, value]) => [key, true]))
  });

  // Timer functions
  const startTimer = () => {
    if (!running) {
      setRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    setSeconds(-20);
    setRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Timing toggle function
  const toggleTiming = (timing) => {
    console.log('toggleTiming', timing);
    setEnabledTimings(prev => ({
      ...prev,
      [timing]: !prev[timing]
    }));
    console.log('enabledTimings', enabledTimings);
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const value = {
    // Timer state
    seconds,
    running,
    // Timer functions
    startTimer,
    stopTimer,
    resetTimer,
    setSeconds,
    // Timing state
    enabledTimings,
    toggleTiming
  };

  return (
    <TimingContext.Provider value={value}>
      {children}
    </TimingContext.Provider>
  );
};

// Client wrapper component that can be imported in server components
export const ClientProviders = ({ children }) => {
  return (
    <TimingProvider>
      {children}
    </TimingProvider>
  );
};
