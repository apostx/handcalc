import { GeminiProvider } from "./geminiProvider";
import { GroqProvider } from "./groqProvider";
import { OpenRouterProvider } from "./openRouterProvider";
import { MockProvider } from "./mockProvider";
import type { AiProviderName, AiVisionProvider } from "./types";

export function createProvider(name: AiProviderName): AiVisionProvider {
  switch (name) {
    case "groq":
      return new GroqProvider();
    case "gemini":
      return new GeminiProvider();
    case "openrouter":
      return new OpenRouterProvider();
    case "mock":
      return new MockProvider();
    default:
      throw new Error(`Unsupported provider: ${name satisfies never}`);
  }
}
