import type { AiEvaluationResult } from "../types/feedback";
import type { AiEvaluationInput, AiVisionProvider } from "./types";

export class MockProvider implements AiVisionProvider {
  name = "mock" as const;
  requiresApiKey = false;

  async evaluate(input: AiEvaluationInput): Promise<AiEvaluationResult> {
    await new Promise(resolve => setTimeout(resolve, 700));

    return {
      transcription: input.exercise.expectedAnswerLatex,
      finalAnswer: input.exercise.expectedAnswerLatex,
      isCorrect: true,
      score: 100,
      feedback:
        "Mock feedback: the solution looks correct. (No AI was called; select Groq or Gemini for real evaluation.)",
      hint: "",
      fullSolution: "",
      handwritingUnclear: false
    };
  }
}
