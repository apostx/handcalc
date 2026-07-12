import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "katex/dist/katex.min.css";
import "./index.css";
import App from "./App";
import type { AiProviderName } from "./providers/types";
import { saveApiKey, saveRememberFlag } from "./storage/apiKeyStorage";
import { consumeSharedKeys } from "./storage/shareLink";

// Keys arriving via a share link are persisted immediately so the recipient
// can practice right away and after refreshes.
const shared = consumeSharedKeys();
if (shared) {
  saveRememberFlag(true);
  for (const [provider, key] of Object.entries(shared.keys)) {
    if (key) saveApiKey(provider as AiProviderName, key);
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App initialProvider={shared?.provider} />
  </StrictMode>
);
