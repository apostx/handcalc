import { buildEvaluationPrompt } from "../ai/buildEvaluationPrompt";
import { parseAiResponse } from "../ai/parseAiResponse";
import type { AiEvaluationResult } from "../types/feedback";
import { readApiErrorMessage } from "./httpError";
import {
  AiRequestError,
  type AiEvaluationInput,
  type AiVisionProvider
} from "./types";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

export class GroqProvider implements AiVisionProvider {
  name = "groq" as const;
  requiresApiKey = true;

  async evaluate(input: AiEvaluationInput): Promise<AiEvaluationResult> {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${input.apiKey}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: buildEvaluationPrompt(input.exercise) },
              {
                type: "image_url",
                image_url: {
                  url: `data:${input.imageMimeType};base64,${input.imageBase64}`
                }
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new AiRequestError(`Groq: ${await readApiErrorMessage(response)}`);
    }

    const data = await response.json();
    const text: unknown = data?.choices?.[0]?.message?.content;
    if (typeof text !== "string") {
      throw new AiRequestError("Groq response contained no text output.");
    }
    return parseAiResponse(text);
  }
}
