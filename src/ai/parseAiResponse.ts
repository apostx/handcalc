import { z } from "zod";
import type { AiEvaluationResult } from "../types/feedback";

// Tolerant schema: coerce/fallback rather than reject, so minor quirks
// (score as a string, a missing field) don't fail the whole response.
const aiResponseSchema = z.object({
  transcription: z.string().catch(""),
  finalAnswer: z.string().nullish().catch(undefined),
  isCorrect: z.boolean().nullish().catch(null),
  score: z.coerce.number().catch(0),
  feedback: z.string().catch(""),
  hint: z.string().nullish().catch(undefined),
  fullSolution: z.string().nullish().catch(undefined),
  handwritingUnclear: z.boolean().nullish().catch(false)
});

export class AiResponseParseError extends Error {}

function snippet(text: string): string {
  return text.slice(0, 160).replace(/\s+/g, " ").trim();
}

// Reasoning models (e.g. Qwen on Groq) prepend a <think>...</think> block,
// which can contain LaTeX braces and derail JSON extraction. Drop it first.
function stripReasoning(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/gi, "");
}

// Models sometimes wrap JSON in code fences or add stray text; extract the
// outermost JSON object before parsing.
function extractJsonObject(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new AiResponseParseError(
      `No JSON object in AI response (starts: "${snippet(text)}")`
    );
  }
  return text.slice(start, end + 1);
}

// Escape stray backslashes (e.g. raw LaTeX like \sin) that aren't valid JSON
// escapes, so JSON.parse doesn't choke when the model skips JSON mode.
function sanitizeJsonEscapes(json: string): string {
  return json.replace(/\\(?!["\\/bfnrtu]|u[0-9a-fA-F]{4})/g, "\\\\");
}

export function parseAiResponse(rawText: string): AiEvaluationResult {
  const jsonText = extractJsonObject(stripReasoning(rawText));

  let json: unknown;
  try {
    json = JSON.parse(jsonText);
  } catch {
    try {
      json = JSON.parse(sanitizeJsonEscapes(jsonText));
    } catch {
      throw new AiResponseParseError(
        `AI response was not valid JSON (starts: "${snippet(rawText)}")`
      );
    }
  }

  const parsed = aiResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new AiResponseParseError("AI response JSON had an unexpected shape.");
  }

  const data = parsed.data;
  return {
    transcription: data.transcription,
    finalAnswer: data.finalAnswer ?? undefined,
    isCorrect: data.isCorrect ?? null,
    score: Math.max(0, Math.min(100, Math.round(data.score))),
    feedback: data.feedback,
    hint: data.hint ?? undefined,
    fullSolution: data.fullSolution ?? undefined,
    handwritingUnclear: data.handwritingUnclear ?? false
  };
}
