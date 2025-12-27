import React, { useState, useRef } from 'react';
import { Upload, Sun, Contrast, X } from 'lucide-react';
import { ImageConfig } from '../types';

interface ImageWorkspaceProps {
  imageSrc: string | null;
  onImageUpload: (file: File) => void;
  onClear: () => void;
  config: ImageConfig;
  setConfig: React.Dispatch<React.SetStateAction<ImageConfig>>;
}

export const ImageWorkspace: React.FC<ImageWorkspaceProps> = ({ 
  imageSrc, 
  onImageUpload, 
  onClear,
  config,
  setConfig
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <div className="flex-1 p-6 flex flex-col min-h-0">
      {/* Controls Bar */}
      <div className="flex items-center justify-between mb-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-primary-500/20 active:scale-95"
        >
          <Upload size={18} />
          <span>Upload Scan</span>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleChange} 
        />

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Sun size={16} className="text-slate-400" />
            <input 
              type="range" 
              min="50" 
              max="150" 
              value={config.brightness} 
              onChange={(e) => setConfig(prev => ({ ...prev, brightness: Number(e.target.value) }))}
              className="w-24 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
              disabled={!imageSrc}
            />
          </div>
          <div className="flex items-center gap-3">
            <Contrast size={16} className="text-slate-400" />
            <input 
              type="range" 
              min="50" 
              max="150" 
              value={config.contrast} 
              onChange={(e) => setConfig(prev => ({ ...prev, contrast: Number(e.target.value) }))}
              className="w-24 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-primary-500"
              disabled={!imageSrc}
            />
          </div>
        </div>
      </div>

      {/* Viewport */}
      <div className="flex-1 bg-black rounded-2xl border-2 border-dashed border-slate-800 relative overflow-hidden flex items-center justify-center group">
        {!imageSrc ? (
          <div 
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${dragActive ? 'bg-slate-800/50 border-primary-500' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-4 border border-slate-700 group-hover:border-primary-500/50 transition-colors">
              <Upload size={32} className="text-slate-500 group-hover:text-primary-400" />
            </div>
            <p className="text-slate-400 font-medium">Drag & drop MRI scan here</p>
            <p className="text-slate-600 text-sm mt-2">Supports JPG, PNG, DICOM (Image)</p>
          </div>
        ) : (
          <div className="relative w-full h-full p-4 flex items-center justify-center bg-[url('https://assets.codepen.io/1462889/grid-pattern.png')] bg-repeat opacity-100">
             <img 
               src={imageSrc} 
               alt="MRI Scan" 
               className="max-h-full max-w-full object-contain shadow-2xl rounded-sm"
               style={{ 
                 filter: `brightness(${config.brightness}%) contrast(${config.contrast}%)` 
               }}
             />
             {/* Overlay for "medical feel" */}
             <div className="absolute top-4 left-4 font-mono text-xs text-slate-500/50 pointer-events-none select-none">
                <p>SEQ: T1-WEIGHTED</p>
                <p>POS: AXIAL</p>
                <p>TE: 12ms / TR: 450ms</p>
             </div>
             
             <div className="absolute inset-0 pointer-events-none border-[20px] border-slate-900/20" />
             
             <button 
                onClick={onClear}
                className="absolute top-4 right-4 p-2 bg-slate-900/80 text-slate-300 rounded-full hover:bg-rose-500 hover:text-white transition-colors backdrop-blur-md"
             >
               <X size={20} />
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
