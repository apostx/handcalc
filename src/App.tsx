import { useRef, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { SettingsPanel } from "./components/SettingsPanel";
import { TopicSelector } from "./components/TopicSelector";
import { DifficultySelector } from "./components/DifficultySelector";
import { ExerciseView } from "./components/ExerciseView";
import {
  DrawingCanvas,
  type DrawingCanvasHandle,
  type DrawingTool
} from "./components/DrawingCanvas";
import { DrawingToolbar } from "./components/DrawingToolbar";
import { FeedbackPanel } from "./components/FeedbackPanel";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { ErrorBox } from "./components/ErrorBox";
import { getNextExercise } from "./generators";
import { createProvider } from "./providers/providerFactory";
import type { AiProviderName } from "./providers/types";
import { AiResponseParseError } from "./ai/parseAiResponse";
import {
  exportCanvasImage,
  MAX_IMAGE_BYTES
} from "./canvas/exportCanvasImage";
import {
  loadApiKey,
  loadRememberFlag,
  saveApiKey,
  saveRememberFlag
} from "./storage/apiKeyStorage";
import type { Exercise, Topic } from "./types/exercise";
import type { AiEvaluationResult } from "./types/feedback";

type Screen = "start" | "practice";

type AppProps = {
  /** Provider preselected by a share link. */
  initialProvider?: AiProviderName;
};

export default function App({ initialProvider }: AppProps) {
  const [screen, setScreen] = useState<Screen>("start");

  const [provider, setProvider] = useState<AiProviderName>(
    initialProvider ?? "mock"
  );
  const [rememberKey, setRememberKey] = useState(loadRememberFlag);
  const [apiKeys, setApiKeys] = useState<Record<AiProviderName, string>>(() => {
    const remember = loadRememberFlag();
    return {
      groq: remember ? loadApiKey("groq") : "",
      gemini: remember ? loadApiKey("gemini") : "",
      mock: ""
    };
  });

  const [topic, setTopic] = useState<Topic>("derivative");
  const [level, setLevel] = useState(1);

  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [feedback, setFeedback] = useState<AiEvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tool, setTool] = useState<DrawingTool>("pen");

  const canvasRef = useRef<DrawingCanvasHandle>(null);

  function handleApiKeyChange(value: string) {
    setApiKeys(prev => ({ ...prev, [provider]: value }));
    if (rememberKey && provider !== "mock") {
      saveApiKey(provider, value);
    }
  }

  function handleRememberKeyChange(remember: boolean) {
    setRememberKey(remember);
    saveRememberFlag(remember);
    if (remember) {
      saveApiKey("groq", apiKeys.groq);
      saveApiKey("gemini", apiKeys.gemini);
    }
  }

  function loadExercise() {
    setExercise(getNextExercise(topic, level));
    setFeedback(null);
    setError(null);
    canvasRef.current?.clear();
  }

  function handleStartPractice() {
    loadExercise();
    setScreen("practice");
  }

  async function handleSubmit() {
    if (!exercise) return;
    setError(null);

    const providerImpl = createProvider(provider);
    const apiKey = apiKeys[provider].trim();

    if (providerImpl.requiresApiKey && !apiKey) {
      setError("Enter an API key to submit.");
      return;
    }

    const canvasHandle = canvasRef.current;
    const canvasEl = canvasHandle?.getCanvas();
    if (!canvasHandle || !canvasEl) return;

    if (canvasHandle.isEmpty()) {
      setError("It looks like you haven't written anything in the solution area yet.");
      return;
    }

    const image = exportCanvasImage(canvasEl);
    if (image.byteSize > MAX_IMAGE_BYTES) {
      setError("The image is too large. Try clearing the canvas and submitting again.");
      return;
    }

    setLoading(true);
    setFeedback(null);
    try {
      const result = await providerImpl.evaluate({
        apiKey,
        exercise,
        imageBase64: image.base64,
        imageMimeType: image.mimeType
      });
      setFeedback(result);
    } catch (err) {
      if (err instanceof AiResponseParseError) {
        setError("The AI response could not be processed. Try again.");
      } else {
        setError("The AI request failed. Check your API key or try again later.");
      }
    } finally {
      setLoading(false);
    }
  }

  if (screen === "start") {
    return (
      <div className="app">
        <AppHeader />
        <p className="prototype-warning">
          This is a prototype. Refreshing the page resets the current exercise
          and solution. Your own AI API key is used directly in your browser.
        </p>

        <SettingsPanel
          provider={provider}
          apiKeys={apiKeys}
          rememberKey={rememberKey}
          onProviderChange={setProvider}
          onApiKeyChange={handleApiKeyChange}
          onRememberKeyChange={handleRememberKeyChange}
        />

        <div className="selectors">
          <TopicSelector value={topic} onChange={setTopic} />
          <DifficultySelector value={level} onChange={setLevel} />
        </div>

        <button
          type="button"
          className="btn btn-primary btn-large"
          onClick={handleStartPractice}
        >
          Start practice
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <AppHeader onOpenSettings={() => setScreen("start")} />

      {exercise && <ExerciseView exercise={exercise} />}

      <div className="practice-actions">
        <button type="button" className="btn" onClick={loadExercise}>
          New exercise
        </button>
      </div>

      <DrawingToolbar
        tool={tool}
        onToolChange={setTool}
        onClear={() => canvasRef.current?.clear()}
      />
      <DrawingCanvas tool={tool} ref={canvasRef} />

      <button
        type="button"
        className="btn btn-primary btn-large"
        onClick={handleSubmit}
        disabled={loading}
      >
        Submit
      </button>

      {error && <ErrorBox message={error} onDismiss={() => setError(null)} />}
      {feedback && exercise && (
        <FeedbackPanel result={feedback} exercise={exercise} />
      )}
      {loading && <LoadingOverlay />}
    </div>
  );
}
