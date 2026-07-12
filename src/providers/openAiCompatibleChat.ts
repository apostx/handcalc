import { buildEvaluationPrompt } from "../ai/buildEvaluationPrompt";
import { parseAiResponse } from "../ai/parseAiResponse";
import type { AiEvaluationResult } from "../types/feedback";
import { readApiErrorMessage } from "./httpError";
import { AiRequestError, type AiEvaluationInput } from "./types";

// Groq and OpenRouter both speak the OpenAI chat-completions dialect with the
// same vision message shape, so they share one request path.
export type OpenAiCompatibleConfig = {
  url: string;
  model: string;
  /** Human-readable name used to prefix error messages. */
  label: string;
  /** Send response_format: json_object. Not every model supports it. */
  jsonMode: boolean;
  extraHeaders?: Record<string, string>;
};

export async function evaluateOpenAiCompatible(
  config: OpenAiCompatibleConfig,
  input: AiEvaluationInput
): Promise<AiEvaluationResult> {
  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.apiKey}`,
      ...config.extraHeaders
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.2,
      ...(config.jsonMode
        ? { response_format: { type: "json_object" } }
        : {}),
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
    throw new AiRequestError(
      `${config.label}: ${await readApiErrorMessage(response)}`
    );
  }

  const data = await response.json();
  const text: unknown = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string") {
    throw new AiRequestError(
      `${config.label} response contained no text output.`
    );
  }
  return parseAiResponse(text);
}
