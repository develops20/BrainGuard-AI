import React from 'react';
import { ShieldCheck, AlertTriangle, Activity, FileWarning, PlayCircle, Loader2 } from 'lucide-react';
import { DiagnosisResult, AppStatus } from '../types';

interface DiagnosticPanelProps {
  status: AppStatus;
  result: DiagnosisResult | null;
  onAnalyze: () => void;
  disabled: boolean;
}

export const DiagnosticPanel: React.FC<DiagnosticPanelProps> = ({ status, result, onAnalyze, disabled }) => {
  
  const renderContent = () => {
    if (status === AppStatus.ANALYZING) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Loader2 size={48} className="text-primary-500 animate-spin mb-4" />
          <h3 className="text-lg font-medium text-slate-200">Processing Scan</h3>
          <p className="text-slate-500 text-sm mt-2">Analyzing tissue density...</p>
        </div>
      );
    }

    if (status === AppStatus.COMPLETE && result) {
      if (!result.isMRI) {
        return (
          <div className="bg-rose-950/30 border border-rose-900/50 rounded-2xl p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-rose-900/50 flex items-center justify-center mb-4 border border-rose-800">
               <FileWarning size={32} className="text-rose-500" />
            </div>
            <h3 className="text-xl font-bold text-rose-500 mb-1">Invalid Image</h3>
            <p className="text-rose-200/70 text-sm mb-4">
              The uploaded image does not appear to be a valid brain MRI scan.
            </p>
            <div className="bg-slate-900/50 rounded-lg p-3 w-full text-left border border-slate-800">
                <p className="text-xs text-slate-400 font-mono">REASONING:</p>
                <p className="text-sm text-slate-300 mt-1">{result.reasoning}</p>
            </div>
          </div>
        );
      }

      const isHealthy = !result.hasTumor;
      
      return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col items-center justify-center py-6">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 border-4 shadow-[0_0_30px_rgba(0,0,0,0.3)] ${
              isHealthy 
                ? 'bg-emerald-950/30 border-emerald-500/50 shadow-emerald-900/20' 
                : 'bg-rose-950/30 border-rose-500/50 shadow-rose-900/20'
            }`}>
              {isHealthy ? (
                <ShieldCheck size={48} className="text-emerald-500" />
              ) : (
                <AlertTriangle size={48} className="text-rose-500" />
              )}
            </div>
            
            <h2 className={`text-2xl font-bold mb-1 ${isHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>
              {isHealthy ? 'No Tumor Detected' : 'Tumor Detected'}
            </h2>
            <p className="text-slate-500 text-sm">Diagnostic Result</p>
          </div>

          {/* Confidence Meter */}
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700/50">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm text-slate-400 font-medium">AI Confidence</span>
              <span className="text-2xl font-mono text-white">{result.confidence.toFixed(1)}%</span>
            </div>
            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  isHealthy ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                style={{ width: `${result.confidence}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-3 font-mono leading-relaxed">
              <span className="text-primary-400 font-bold">ANALYSIS: </span>
              {result.reasoning}
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-64 text-center opacity-50">
        <Activity size={48} className="text-slate-600 mb-4" />
        <h3 className="text-lg font-medium text-slate-400">Ready for Diagnosis</h3>
        <p className="text-slate-600 text-sm mt-2 max-w-[200px]">
          Upload an MRI scan to begin the AI analysis.
        </p>
      </div>
    );
  };

  return (
    <div className="w-96 bg-slate-900 border-l border-slate-800 p-6 flex flex-col z-10">
      <div className="mb-8">
        <h2 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-6">Diagnostic Report</h2>
        {renderContent()}
      </div>

      <div className="mt-auto">
        <button
          onClick={onAnalyze}
          disabled={disabled || status === AppStatus.ANALYZING}
          className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
            disabled || status === AppStatus.ANALYZING
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-900/20 active:scale-95'
          }`}
        >
          {status === AppStatus.ANALYZING ? (
            <>Analyzing...</>
          ) : (
            <>
              <PlayCircle size={20} />
              START DIAGNOSIS
            </>
          )}
        </button>
        <p className="text-[10px] text-center text-slate-600 mt-4 px-4">
          * NeuroVision AI is a support tool. Results must be verified by a certified radiologist.
        </p>
      </div>
    </div>
  );
};
