import type { Exercise } from "../types/exercise";
import type { AiEvaluationResult } from "../types/feedback";

export type AiProviderName = "groq" | "gemini" | "mock";

export type AiEvaluationInput = {
  apiKey: string;
  exercise: Exercise;
  /** Raw base64 payload without the data: URL prefix. */
  imageBase64: string;
  imageMimeType: string;
};

export interface AiVisionProvider {
  name: AiProviderName;
  /** Whether the provider needs a real API key. */
  requiresApiKey: boolean;
  evaluate(input: AiEvaluationInput): Promise<AiEvaluationResult>;
}

export class AiRequestError extends Error {}

export const PROVIDER_LABELS: Record<AiProviderName, string> = {
  groq: "Groq (Llama 4 Scout)",
  gemini: "Google Gemini (2.5 Flash)",
  mock: "Mock (testing, no API key needed)"
};

export const ALL_PROVIDERS: AiProviderName[] = ["groq", "gemini", "mock"];
