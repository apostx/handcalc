import type { AiEvaluationResult } from "../types/feedback";
import { evaluateOpenAiCompatible } from "./openAiCompatibleChat";
import type { AiEvaluationInput, AiVisionProvider } from "./types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
// Qwen VL reads handwriting/math well and, unlike the Llama 4 vision models,
// is still active on Groq (Scout shuts down 2026-07-17, Maverick already did).
const GROQ_MODEL = "qwen/qwen3.6-27b";

export class GroqProvider implements AiVisionProvider {
  name = "groq" as const;
  requiresApiKey = true;

  evaluate(input: AiEvaluationInput): Promise<AiEvaluationResult> {
    // Turn off Qwen's chain-of-thought: otherwise it burns the whole token
    // budget on <think> and never reaches the JSON (finish_reason: length).
    // With reasoning off, JSON mode yields clean, complete JSON.
    return evaluateOpenAiCompatible(
      {
        url: GROQ_URL,
        model: GROQ_MODEL,
        label: "Groq",
        jsonMode: true,
        reasoningEffort: "none",
        maxTokens: 2048
      },
      input
    );
  }
}
