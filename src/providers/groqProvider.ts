import type { AiEvaluationResult } from "../types/feedback";
import { evaluateOpenAiCompatible } from "./openAiCompatibleChat";
import type { AiEvaluationInput, AiVisionProvider } from "./types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// Maverick (128 experts) reads handwriting noticeably better than Scout.
const GROQ_MODEL = "meta-llama/llama-4-maverick-17b-128e-instruct";

export class GroqProvider implements AiVisionProvider {
  name = "groq" as const;
  requiresApiKey = true;

  evaluate(input: AiEvaluationInput): Promise<AiEvaluationResult> {
    return evaluateOpenAiCompatible(
      { url: GROQ_URL, model: GROQ_MODEL, label: "Groq", jsonMode: true },
      input
    );
  }
}
