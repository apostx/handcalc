// Both Gemini and the OpenAI-compatible Groq API return errors as
// { error: { message, ... } }. Surface that message so the UI can tell the
// user what actually went wrong (e.g. a project-level denial) instead of a
// generic "check your API key".
export async function readApiErrorMessage(
  response: Response
): Promise<string> {
  try {
    const data = await response.json();
    const message = data?.error?.message ?? data?.message;
    if (typeof message === "string" && message.trim()) return message.trim();
  } catch {
    // Body was not JSON; fall through to the status-only message.
  }
  return `HTTP ${response.status}`;
}
