// Both Gemini and the OpenAI-compatible Groq API return errors as
// { error: { message, ... } }. Surface that message so the UI can tell the
// user what actually went wrong (e.g. a project-level denial) instead of a
// generic "check your API key".
export async function readApiErrorMessage(
  response: Response
): Promise<string> {
  try {
    const data = await response.json();
    const error = data?.error ?? data;
    let message: string =
      typeof error?.message === "string" ? error.message.trim() : "";

    // OpenRouter tucks the useful upstream detail (e.g. "temporarily
    // rate-limited") into error.metadata.raw; append it when present.
    const raw = error?.metadata?.raw;
    const rawText =
      typeof raw === "string" ? raw.trim() : raw ? JSON.stringify(raw) : "";
    if (rawText && rawText !== message) {
      message = message ? `${message} — ${rawText}` : rawText;
    }

    if (message) return message;
  } catch {
    // Body was not JSON; fall through to the status-only message.
  }
  return `HTTP ${response.status}`;
}
