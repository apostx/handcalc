import {
  KEYED_PROVIDERS,
  type AiProviderName,
  type KeyedProvider
} from "../providers/types";

// API keys travel in the URL fragment (#share=...): the fragment is never
// sent to the server or written to access logs, and it is consumed and
// stripped from the address bar on first load. Base64url is encoding, not
// encryption — anyone holding the full link can use the keys.

export type ProviderKeys = Partial<Record<KeyedProvider, string>>;

export type SharedKeys = {
  provider?: AiProviderName;
  keys: ProviderKeys;
};

type SharePayload = {
  v: 1;
  p?: string;
  k: ProviderKeys;
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
  keys: ProviderKeys,
  provider: AiProviderName
): string {
  const payload: SharePayload = { v: 1, p: provider, k: {} };
  for (const name of KEYED_PROVIDERS) {
    const value = keys[name]?.trim();
    if (value) payload.k[name] = value;
  }

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

    const keys: ProviderKeys = {};
    for (const name of KEYED_PROVIDERS) {
      const value = payload.k[name];
      if (typeof value === "string" && value) keys[name] = value;
    }

    if (Object.keys(keys).length === 0) return null;

    const shared: SharedKeys = { keys };
    if (
      payload.p === "groq" ||
      payload.p === "gemini" ||
      payload.p === "openrouter"
    ) {
      shared.provider = payload.p;
    }
    return shared;
  } catch {
    return null;
  }
}
