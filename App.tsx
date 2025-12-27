import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ImageWorkspace } from './components/ImageWorkspace';
import { DiagnosticPanel } from './components/DiagnosticPanel';
import { analyzeMRI } from './services/geminiService';
import { DiagnosisResult, AppStatus, ImageConfig } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [config, setConfig] = useState<ImageConfig>({ brightness: 100, contrast: 100 });

  const handleImageUpload = (file: File) => {
    setRawFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      // Reset state on new image
      setStatus(AppStatus.IDLE);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setImageSrc(null);
    setRawFile(null);
    setResult(null);
    setStatus(AppStatus.IDLE);
    setConfig({ brightness: 100, contrast: 100 });
  };

  const runDiagnosis = async () => {
    if (!imageSrc || !rawFile) return;

    setStatus(AppStatus.ANALYZING);
    
    try {
      // Remove Data URL prefix to get pure base64
      const base64Data = imageSrc.split(',')[1];
      const mimeType = rawFile.type;

      const data = await analyzeMRI(base64Data, mimeType);
      
      setResult(data);
      setStatus(AppStatus.COMPLETE);
    } catch (error) {
      console.error(error);
      setStatus(AppStatus.ERROR);
      alert("Analysis failed. Please try again.");
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        <main className="flex-1 flex min-h-0">
          <ImageWorkspace 
            imageSrc={imageSrc}
            onImageUpload={handleImageUpload}
            onClear={handleClear}
            config={config}
            setConfig={setConfig}
          />
          <DiagnosticPanel 
            status={status}
            result={result}
            onAnalyze={runDiagnosis}
            disabled={!imageSrc}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
