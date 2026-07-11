import type { AiProviderName } from "../providers/types";

// API keys travel in the URL fragment (#share=...): the fragment is never
// sent to the server or written to access logs, and it is consumed and
// stripped from the address bar on first load. Base64url is encoding, not
// encryption — anyone holding the full link can use the keys.

export type SharedKeys = {
  provider?: AiProviderName;
  groq?: string;
  gemini?: string;
};

type SharePayload = {
  v: 1;
  p?: string;
  k: { groq?: string; gemini?: string };
};

function encodeBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeBase64Url(encoded: string): string {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function buildShareUrl(
  keys: { groq?: string; gemini?: string },
  provider: AiProviderName
): string {
  const payload: SharePayload = { v: 1, p: provider, k: {} };
  if (keys.groq) payload.k.groq = keys.groq;
  if (keys.gemini) payload.k.gemini = keys.gemini;

  const { origin, pathname, search } = window.location;
  return `${origin}${pathname}${search}#share=${encodeBase64Url(
    JSON.stringify(payload)
  )}`;
}

/**
 * Reads shared keys from the URL fragment and strips the fragment so the
 * keys don't linger in the address bar or browser history.
 */
export function consumeSharedKeys(): SharedKeys | null {
  const match = window.location.hash.match(/[#&]share=([A-Za-z0-9_-]+)/);
  if (!match) return null;

  history.replaceState(
    null,
    "",
    window.location.pathname + window.location.search
  );

  try {
    const payload = JSON.parse(decodeBase64Url(match[1])) as SharePayload;
    if (payload.v !== 1 || typeof payload.k !== "object" || payload.k === null) {
      return null;
    }

    const shared: SharedKeys = {};
    if (typeof payload.k.groq === "string" && payload.k.groq) {
      shared.groq = payload.k.groq;
    }
    if (typeof payload.k.gemini === "string" && payload.k.gemini) {
      shared.gemini = payload.k.gemini;
    }
    if (payload.p === "groq" || payload.p === "gemini") {
      shared.provider = payload.p;
    }

    return shared.groq || shared.gemini ? shared : null;
  } catch {
    return null;
  }
}
