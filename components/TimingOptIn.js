"use client";
import React from "react";
import "./TimingOptIn.css";
import { useTimingContext } from "../lib/Providers";
import { TIMINGS } from "../lib/DotaTimings";

const TimingOptIn = () => {
  const { enabledTimings, toggleTiming } = useTimingContext();
//   console.log('enabledTimings', enabledTimings);
  return (
    <div className="timing-opt-in-container">
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Enable Timings</h5>
          {Object.entries(TIMINGS).map(([key, value]) => (
            <div key={key}>
              <input type="checkbox" id={key} checked={enabledTimings[key]} onChange={() => toggleTiming(key)} />
              <label htmlFor={key}> <i className={value.icon}/> {key}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimingOptIn;