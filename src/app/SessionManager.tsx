import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface SessionManagerProps {
  onLogout: () => void;
  isActive: boolean;
}

export function SessionManager({ onLogout, isActive }: SessionManagerProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!isActive) return;

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const resetTimer = () => {
      setShowWarning(false);
      setCountdown(60);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      
      // 30 minutes = 1800000 ms, we will trigger warning at 29 minutes
      timeoutId = setTimeout(() => {
        setShowWarning(true);
      }, 29 * 60 * 1000); 
    };

    const handleActivity = () => {
      if (!showWarning) {
        resetTimer();
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    resetTimer();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isActive, showWarning]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (showWarning && countdown > 0) {
      intervalId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showWarning && countdown === 0) {
      onLogout();
    }
    return () => clearInterval(intervalId);
  }, [showWarning, countdown, onLogout]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Session Timeout</h3>
        <p className="text-slate-600 mb-6">
          Your session will expire in <span className="font-bold text-rose-600">{countdown}</span> seconds due to inactivity.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
          <button
            onClick={() => {
              setShowWarning(false);
              setCountdown(60);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}
