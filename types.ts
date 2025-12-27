export interface DiagnosisResult {
  isMRI: boolean;
  hasTumor: boolean;
  confidence: number;
  reasoning: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export interface ImageConfig {
  brightness: number;
  contrast: number;
}
