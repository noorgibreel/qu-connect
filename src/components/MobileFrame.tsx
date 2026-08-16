"use client";

import React, { useState, useEffect } from "react";

interface MobileFrameProps {
  children: React.ReactNode;
}

export default function MobileFrame({ children }: MobileFrameProps) {
  const [time, setTime] = useState("12:00");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "م" : "ص";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="phone-container">
      {/* Smartphone Bezel Status Bar Area */}
      <div className="phone-notch">
        <div className="w-4 h-4 rounded-full bg-black/40"></div>
      </div>
      
      {/* Status Bar Elements */}
      <div className="flex justify-between items-center px-6 pt-3 pb-2 text-xs font-semibold select-none z-50 text-white bg-emerald-900 border-b border-emerald-800/20">
        <div className="text-right flex-1">{time}</div>
        <div className="flex items-center gap-1.5 justify-end flex-1">
          {/* Signal Icon */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 3c-1.2 0-2.4.4-3.4 1.2L12 21l3.4-16.8C14.4 3.4 13.2 3 12 3zm0 2c.8 0 1.6.3 2.3.8L12 17.5 9.7 5.8c.7-.5 1.5-.8 2.3-.8z" opacity="0.3" />
            <path d="M12 3c-1.2 0-2.4.4-3.4 1.2L12 21l3.4-16.8C14.4 3.4 13.2 3 12 3z" />
          </svg>
          {/* Wifi Icon */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 21l-12-12c2.4-2.4 5.7-4 9.4-4s7 1.6 9.4 4l-12 12z" />
          </svg>
          {/* Battery Icon */}
          <div className="flex items-center gap-0.5 border border-current rounded-sm px-0.5 py-0.25 h-3">
            <div className="w-4 h-1.5 bg-current rounded-2xs"></div>
            <div className="w-0.5 h-1 bg-current rounded-r-2xs"></div>
          </div>
        </div>
      </div>

      {/* Main Screen Content Frame */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
        {children}
      </div>

      {/* Bottom Gesture Indicator */}
      <div className="bg-white py-2 flex justify-center items-center select-none border-t border-gray-100">
        <div className="w-32 h-1.5 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}
