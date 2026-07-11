import {
  ALL_PROVIDERS,
  PROVIDER_LABELS,
  type AiProviderName
} from "../providers/types";

type SettingsPanelProps = {
  provider: AiProviderName;
  apiKey: string;
  rememberKey: boolean;
  onProviderChange: (provider: AiProviderName) => void;
  onApiKeyChange: (apiKey: string) => void;
  onRememberKeyChange: (remember: boolean) => void;
};

export function SettingsPanel({
  provider,
  apiKey,
  rememberKey,
  onProviderChange,
  onApiKeyChange,
  onRememberKeyChange
}: SettingsPanelProps) {
  const needsKey = provider !== "mock";

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

      <p className="privacy-note">
        Your handwritten solution is sent as an image to the selected AI
        provider. Your API key never leaves your browser — this app has no
        backend.
      </p>
    </div>
  );
}
