import { useRef, useState } from "react";
import {
  ALL_PROVIDERS,
  PROVIDER_LABELS,
  type AiProviderName
} from "../providers/types";
import { buildShareUrl } from "../storage/shareLink";

type SettingsPanelProps = {
  provider: AiProviderName;
  apiKeys: Record<AiProviderName, string>;
  rememberKey: boolean;
  onProviderChange: (provider: AiProviderName) => void;
  onApiKeyChange: (apiKey: string) => void;
  onRememberKeyChange: (remember: boolean) => void;
};

export function SettingsPanel({
  provider,
  apiKeys,
  rememberKey,
  onProviderChange,
  onApiKeyChange,
  onRememberKeyChange
}: SettingsPanelProps) {
  const needsKey = provider !== "mock";
  const apiKey = apiKeys[provider];

  const [copied, setCopied] = useState(false);
  const copyResetRef = useRef<number | undefined>(undefined);

  const shareableKeys = {
    groq: apiKeys.groq.trim(),
    gemini: apiKeys.gemini.trim()
  };
  const hasShareableKey = Boolean(shareableKeys.groq || shareableKeys.gemini);

  async function handleShare() {
    // Point the recipient at a provider that actually has a key.
    const shareProvider =
      needsKey && apiKeys[provider].trim()
        ? provider
        : shareableKeys.groq
          ? "groq"
          : "gemini";
    const url = buildShareUrl(shareableKeys, shareProvider);

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.clearTimeout(copyResetRef.current);
      copyResetRef.current = window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt("Copy the share link:", url);
    }
  }

  return (
    <div className="settings-panel">
      <label className="field">
        <span className="field-label">AI provider</span>
        <select
          value={provider}
          onChange={e => onProviderChange(e.target.value as AiProviderName)}
        >
          {ALL_PROVIDERS.map(name => (
            <option key={name} value={name}>
              {PROVIDER_LABELS[name]}
            </option>
          ))}
        </select>
      </label>

      {needsKey && (
        <>
          <label className="field">
            <span className="field-label">API key</span>
            <input
              type="password"
              value={apiKey}
              onChange={e => onApiKeyChange(e.target.value)}
              placeholder={
                provider === "groq" ? "gsk_..." : "AIza..."
              }
              autoComplete="off"
            />
          </label>

          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={rememberKey}
              onChange={e => onRememberKeyChange(e.target.checked)}
            />
            <span>Remember API key on this device</span>
          </label>
        </>
      )}

      {hasShareableKey && (
        <div className="share-row">
          <button type="button" className="btn" onClick={handleShare}>
            {copied ? "Link copied!" : "Share link with keys"}
          </button>
          <span className="share-note">
            Anyone with the link can use your API keys — share it privately.
            Opening the link stores the keys on the device and removes them
            from the URL.
          </span>
        </div>
      )}

      <p className="privacy-note">
        Your handwritten solution is sent as an image to the selected AI
        provider. Your API key never leaves your browser — this app has no
        backend.
      </p>
    </div>
  );
}
