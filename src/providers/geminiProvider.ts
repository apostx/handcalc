import { buildEvaluationPrompt } from "../ai/buildEvaluationPrompt";
import { parseAiResponse } from "../ai/parseAiResponse";
import type { AiEvaluationResult } from "../types/feedback";
import { readApiErrorMessage } from "./httpError";
import {
  AiRequestError,
  type AiEvaluationInput,
  type AiVisionProvider
} from "./types";

const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

export class GeminiProvider implements AiVisionProvider {
  name = "gemini" as const;
  requiresApiKey = true;

  async evaluate(input: AiEvaluationInput): Promise<AiEvaluationResult> {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": input.apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: buildEvaluationPrompt(input.exercise) },
              {
                inline_data: {
                  mime_type: input.imageMimeType,
                  data: input.imageBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new AiRequestError(
        `Gemini: ${await readApiErrorMessage(response)}`
      );
    }

    const data = await response.json();
    const text: unknown =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string") {
      throw new AiRequestError("Gemini response contained no text output.");
    }
    return parseAiResponse(text);
  }
}
