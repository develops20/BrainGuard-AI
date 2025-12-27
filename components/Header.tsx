import React from 'react';
import { Brain } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-slate-800 flex items-center justify-between px-8 bg-slate-900/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <Brain className="text-primary-500" size={28} />
        <h1 className="text-xl font-bold tracking-wider text-slate-100">
          BRAINGUARD <span className="text-primary-500 font-light">AI</span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        <span className="text-xs font-mono text-emerald-500 tracking-widest uppercase">System Ready</span>
      </div>
    </header>
  );
};