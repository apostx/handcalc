import type { AiEvaluationResult } from "../types/feedback";
import { evaluateOpenAiCompatible } from "./openAiCompatibleChat";
import type { AiEvaluationInput, AiVisionProvider } from "./types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
// A free, image-capable model. Swap this id for any current OpenRouter
// ":free" vision model if the lineup changes.
const OPENROUTER_MODEL = "google/gemma-4-31b-it:free";

export class OpenRouterProvider implements AiVisionProvider {
  name = "openrouter" as const;
  requiresApiKey = true;

  evaluate(input: AiEvaluationInput): Promise<AiEvaluationResult> {
    return evaluateOpenAiCompatible(
      {
        url: OPENROUTER_URL,
        model: OPENROUTER_MODEL,
        label: "OpenRouter",
        // Gemma via OpenRouter doesn't support JSON mode; rely on the prompt
        // and the JSON extraction in parseAiResponse instead.
        jsonMode: false,
        extraHeaders: {
          "HTTP-Referer": window.location.origin,
          "X-Title": "HandCalc"
        }
      },
      input
    );
  }
}
