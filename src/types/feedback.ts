export type AiEvaluationResult = {
  transcription: string;
  finalAnswer?: string;
  isCorrect: boolean | null;
  score: number;
  feedback: string;
  hint?: string;
  fullSolution?: string;
  handwritingUnclear?: boolean;
};
