"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Timer.css";
import { getDotaGamePhaseByMinute, TIMINGS } from "../lib/DotaTimings";
import { useTimingContext } from "../lib/Providers";

function formatTime(seconds) {
  const isNegative = seconds < 0;
  const absSeconds = Math.abs(seconds);
  const mins = Math.floor(absSeconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (absSeconds % 60).toString().padStart(2, "0");
  return `${isNegative ? '-' : ''}${mins}:${secs}`;
}

const Timer = () => {
  const { seconds, running, startTimer, stopTimer, resetTimer, enabledTimings, setSeconds } = useTimingContext();
  const previousPhaseRef = useRef(null);
  const previousSecondsRef = useRef(-20);
  const audioRef = useRef(null);
  const [hoverTime, setHoverTime] = useState(null);
  const [showHoverTime, setShowHoverTime] = useState(false);

  const MAX_SECONDS = 90 * 60; // 90 minutes in seconds
  const MIN_SECONDS = -20; // Start at -20 seconds

  // Calculate progress percentage (0-100) - adjust for negative start
  const adjustedSeconds = Math.max(0, seconds + 20); // Add 20 to account for -20 start
  const progressPercentage = Math.min((adjustedSeconds / (MAX_SECONDS + 20)) * 100, 100);

  // Get current game phase (only for positive seconds)
  const currentMinute = Math.floor(Math.max(0, seconds) / 60);
  const currentPhase = seconds >= 0 ? getDotaGamePhaseByMinute(currentMinute) : null;

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/boom.mp3');
    audioRef.current.preload = 'auto';
  }, []);

  // Handle progress bar click
  const handleProgressClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickPercentage = (clickX / rect.width) * 100;
    const newSeconds = Math.round((clickPercentage / 100) * (MAX_SECONDS + 20)) + MIN_SECONDS;
    setSeconds(Math.max(MIN_SECONDS, Math.min(newSeconds, MAX_SECONDS)));
  };

  // Handle progress bar hover
  const handleProgressHover = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const hoverPercentage = (hoverX / rect.width) * 100;
    const targetSeconds = Math.round((hoverPercentage / 100) * (MAX_SECONDS + 20)) + MIN_SECONDS;
    setHoverTime(Math.max(MIN_SECONDS, Math.min(targetSeconds, MAX_SECONDS)));
    setShowHoverTime(true);
  };

  // Handle mouse leave
  const handleProgressLeave = () => {
    setShowHoverTime(false);
    setHoverTime(null);
  };

  // Check for phase changes and play sound
  useEffect(() => {
    if (previousPhaseRef.current !== null && 
        previousPhaseRef.current !== currentPhase && 
        currentPhase !== null &&
        running) {
      // Phase changed, play sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Reset to beginning
        audioRef.current.play().catch(error => {
          console.log('Audio play failed:', error);
        });
      }
    }
    previousPhaseRef.current = currentPhase;
  }, [currentPhase, running]);

  // Check for timing events and play sounds
  useEffect(() => {
    if (running && seconds > previousSecondsRef.current) {
      // Timer is running and moving forward
      Object.entries(TIMINGS).forEach(([name, timingData]) => {
        if (enabledTimings[name]) {
          timingData.timings.forEach(timing => {
            // Check if we just crossed this timing
            if (previousSecondsRef.current < timing && seconds >= timing) {
              // Play specific sound for this timing category
              const audio = new Audio(`/${timingData.sound}`);
              audio.play().catch(error => {
                console.log(`${name} audio play failed:`, error);
              });
            }
          });
        }
      });
    }
    previousSecondsRef.current = seconds;
  }, [seconds, running, enabledTimings]);

  // Reset previous references when timer is reset
  useEffect(() => {
    if (seconds === -20) {
      previousPhaseRef.current = null;
      previousSecondsRef.current = -20;
    }
  }, [seconds]);

  // Test sound function
  const testSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => {
        console.log('Audio test failed:', error);
      });
    }
  };

  // Get upcoming timings (only show future timings)
  const getUpcomingTimings = () => {
    const allTimings = [];
    
    Object.entries(TIMINGS).forEach(([name, timingData]) => {
      if (enabledTimings[name]) {
        timingData.timings.forEach(timing => {
          // Only include timings that haven't passed yet
          if (seconds < timing) {
            allTimings.push({
              name,
              timing,
              icon: timingData.icon,
              passed: false
            });
          }
        });
      }
    });
    
    // Sort by timing (seconds)
    return allTimings.sort((a, b) => a.timing - b.timing);
  };

  const upcomingTimings = getUpcomingTimings();

  return (
    <div className="timer-container">
      <div className="timer-display">
        {formatTime(seconds)}
      </div>
      {currentPhase && (
        <div className="timer-phase">
          {currentPhase}
        </div>
      )}
      <div className="timer-progress">
        <div className="progress" 
             onClick={handleProgressClick}
             onMouseMove={handleProgressHover}
             onMouseLeave={handleProgressLeave}
             style={{ cursor: 'pointer', position: 'relative' }}>
          <div 
            className="progress-bar timer-progress-bar" 
            role="progressbar" 
            style={{ width: `${progressPercentage}%` }}
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {progressPercentage > 10 && `${Math.round(progressPercentage)}%`}
          </div>
          {showHoverTime && (
            <div className="progress-tooltip" style={{
              position: 'absolute',
              top: '-35px',
              left: `${(hoverTime / (MAX_SECONDS + 20)) * 100}%`,
              transform: 'translateX(-50%)',
              background: 'var(--color-background-darker)',
              color: 'var(--color-text-primary)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              zIndex: 10,
              border: '1px solid var(--color-border)'
            }}>
              {formatTime(hoverTime)}
            </div>
          )}
        </div>
      </div>
      <div className="timer-controls">
        <button className="btn btn-success me-2" onClick={startTimer} disabled={running}>
          <i className="bi bi-play"/> Start
        </button>
        <button className="btn btn-warning me-2" onClick={stopTimer} disabled={!running}>
          <i className="bi bi-pause-fill"/> Stop
        </button>
        <button className="btn btn-danger me-2" onClick={resetTimer}>
          <i className="bi bi-arrow-counterclockwise"/> Reset
        </button>
        <button className="btn btn-info btn-sm" onClick={testSound}>
          <i className="bi bi-volume-up"/> Test Sound
        </button>
      </div>
      
      {upcomingTimings.length > 0 && (
        <div className="upcoming-timings">
          <h5>Upcoming Timings</h5>
          <ul className="timing-list">
            {upcomingTimings.map((item, index) => (
              <li key={index} className="timing-item upcoming">
                <i className={item.icon}></i>
                <span className="timing-name">{item.name}</span>
                <span className="timing-time">{formatTime(item.timing)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Timer;
