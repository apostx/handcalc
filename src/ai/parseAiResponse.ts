import { z } from "zod";
import type { AiEvaluationResult } from "../types/feedback";

const aiResponseSchema = z.object({
  transcription: z.string().default(""),
  finalAnswer: z.string().nullish(),
  isCorrect: z.boolean().nullish(),
  score: z.number().default(0),
  feedback: z.string().default(""),
  hint: z.string().nullish(),
  fullSolution: z.string().nullish(),
  handwritingUnclear: z.boolean().nullish()
});

export class AiResponseParseError extends Error {}

// Models sometimes wrap JSON in code fences or add stray text; extract the
// outermost JSON object before parsing.
function extractJsonObject(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new AiResponseParseError("No JSON object found in AI response.");
  }
  return text.slice(start, end + 1);
}

export function parseAiResponse(rawText: string): AiEvaluationResult {
  let json: unknown;
  try {
    json = JSON.parse(extractJsonObject(rawText));
  } catch (err) {
    if (err instanceof AiResponseParseError) throw err;
    throw new AiResponseParseError("AI response is not valid JSON.");
  }

  const parsed = aiResponseSchema.safeParse(json);
  if (!parsed.success) {
    throw new AiResponseParseError("AI response JSON has an unexpected shape.");
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
