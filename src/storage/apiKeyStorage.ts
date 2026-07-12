import { KEYED_PROVIDERS, type AiProviderName } from "../providers/types";

// Keys are stored per provider so switching providers keeps each key.
const keyFor = (provider: AiProviderName) => `handcalc:apiKey:${provider}`;
const REMEMBER_KEY = "handcalc:rememberApiKey";

export function loadApiKey(provider: AiProviderName): string {
  try {
    return localStorage.getItem(keyFor(provider)) ?? "";
  } catch {
    return "";
  }
}

export function saveApiKey(provider: AiProviderName, apiKey: string): void {
  try {
    localStorage.setItem(keyFor(provider), apiKey);
  } catch {
    // localStorage may be unavailable (private mode); key stays in memory only.
  }
}

export function clearStoredApiKeys(): void {
  try {
    localStorage.removeItem(REMEMBER_KEY);
    for (const provider of KEYED_PROVIDERS) {
      localStorage.removeItem(keyFor(provider));
    }
  } catch {
    // ignore
  }
}

export function loadRememberFlag(): boolean {
  try {
    return localStorage.getItem(REMEMBER_KEY) === "1";
  } catch {
    return false;
  }
}

export function saveRememberFlag(remember: boolean): void {
  try {
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, "1");
    } else {
      clearStoredApiKeys();
    }
  } catch {
    // ignore
  }
}
