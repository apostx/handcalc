# HandCalc Trainer

A backend-free web app for practicing MAT I style differentiation, integration, limits, tangent/normal line, and local extrema exercises from the basics to exam-like tasks.

The app renders a math exercise, lets the student solve it by handwriting on a canvas, then sends the handwritten solution image to a user-selected multimodal AI provider for transcription and feedback. The first version intentionally has no user accounts, no database, and no persistent session state.

---

## Project name ideas

Recommended name: **HandCalc**

Other possible names:

- **DerivaDraw**
- **Inktegral**
- **CalcCanvas**
- **MatekInk**
- **MathInk Trainer**
- **Derivio**
- **IntegralPad**
- **MAT I Ink**
- **FormulaSketch**
- **CalcScribe**

---

## Main goal

Build a simple, stateless, GitHub Pages compatible prototype where a student can:

1. Select a topic and difficulty.
2. Receive a generated or pre-defined math exercise.
3. Handwrite the solution on a drawing canvas.
4. Submit the canvas image to an AI vision model using their own API key.
5. Receive Hungarian feedback:
   - what the AI read from the handwriting,
   - whether the solution seems correct,
   - what mistake was found,
   - one short hint,
   - optionally the full solution.

The app is intended as a free hobby project. It should work without a backend and without user login.

---

## Core constraints

### Must have

- Static frontend only.
- Deployable to GitHub Pages.
- No backend required for MVP.
- No user account system.
- No database.
- Refresh may reset the full app state.
- User provides their own AI API key.
- API calls are made directly from the browser.
- Exercises are generated locally or loaded from local JSON/TypeScript data.
- The AI should not be the source of truth for exercise generation.
- The AI should mainly read the handwritten answer and provide feedback.

### Nice to have later

- Optional API key saving in `localStorage`.
- Optional progress saving.
- Optional handwriting sample.
- Optional PWA support.
- Optional backend/serverless proxy later if needed.

### Out of scope for MVP

- Own handwriting recognition model.
- User authentication.
- Cloud database.
- Payment.
- Admin panel.
- Live OCR while writing.
- Full CAS-level mathematical proof validation.
- Multiplayer/classroom features.

---

## Recommended MVP architecture

```txt
GitHub Pages
  |
  v
React + TypeScript + Vite app
  |
  | Local exercise generator / local exercise bank
  |
  v
Canvas handwriting input
  |
  | User submits answer
  |
  v
AI provider adapter
  |
  | Direct browser call with user-provided API key
  |
  v
Groq or Gemini vision model
  |
  v
JSON feedback rendered in the UI
```

No server is required in the first version.

---

## Suggested technology stack

### Frontend

- React
- TypeScript
- Vite
- KaTeX for rendering LaTeX formulas
- HTML Canvas with Pointer Events
- CSS modules or plain CSS

### Optional libraries

- `katex` for formula rendering.
- `uuid` or `crypto.randomUUID()` for generated exercise IDs.
- `zod` for validating AI JSON responses.
- `mathjs`, `nerdamer`, or `algebrite` later for local symbolic checks.

Do not introduce a state management framework for the MVP unless clearly necessary. React state is enough.

---

## Key design decision: no persistent session

In the MVP, refresh can reset:

- current exercise,
- selected topic,
- selected difficulty,
- handwritten canvas,
- feedback,
- handwriting sample.

This is intentional.

The only optional persistent value may be the API key, and even that should be controlled by the user through a checkbox.

Recommended API key behavior:

```txt
[ ] Remember API key on this device
```

If unchecked:

- keep the key only in React memory,
- lose it on refresh.

If checked:

- save it to `localStorage`,
- load it on next app start,
- allow deleting it from settings.

---

## User flow

### First screen

The user sees:

- app title,
- short prototype warning,
- AI provider selector,
- API key input,
- topic selector,
- difficulty selector,
- "Start practice" button.

Prototype warning text:

```txt
Ez egy prototípus. Refresh után a jelenlegi feladat és megoldás elveszhet.
A saját AI API kulcsodat használod, ami csak a böngésződben kerül felhasználásra.
```

### Practice screen

The user sees:

- exercise topic,
- difficulty level,
- rendered exercise text/formula,
- handwriting canvas,
- toolbar,
- submit button,
- feedback panel.

Toolbar:

- pen
- eraser or clear only for MVP
- clear canvas
- optional undo later
- optional redo later

### Submission flow

1. Convert canvas to PNG or WebP base64.
2. Build an AI prompt with:
   - exercise text,
   - expected answer,
   - solution steps,
   - handwritten image.
3. Call selected AI provider.
4. Validate returned JSON.
5. Display:
   - transcription,
   - score,
   - correctness,
   - feedback,
   - hint,
   - optional full solution.

---

## Topics

MVP should support at least:

1. Differentiation
2. Integration
3. Limits
4. Tangent and normal line
5. Local extrema

The first working prototype can start with only 2 topics:

- Differentiation
- Integration

Then extend.

---

## Difficulty model

Use 5 levels.

### Level 0: handwriting warm-up

Optional for MVP.

The user copies simple symbols:

```txt
0 1 2 3 4 5 6 7 8 9
+ - * / = ^ ( )
x y z
sin cos ln arctan
sqrt
integral sign
dx
```

This is not used to train a recognizer. It can later be sent as an additional reference image to the AI.

### Level 1: basics

- Power rule
- Simple polynomial derivative
- Basic indefinite integrals
- Direct substitution limits

### Level 2: standard functions

- `sin x`
- `cos x`
- `ln x`
- `e^x`
- `arctan x`
- simple combinations

### Level 3: chain rule / substitution

- `sin(3x)`
- `ln(x^2 + 1)`
- `arctan(sqrt(x))`
- simple substitution integrals

### Level 4: product / quotient / more complex limits

- `x^2 ln x`
- `(sin x) / x`
- `0/0` limits
- partial integration basics

### Level 5: exam style

- tangent and normal line
- local extrema
- definite integrals
- mixed multi-step tasks

---

## Exercise data model

Use a single common shape.

```ts
export type Topic =
  | "derivative"
  | "integral"
  | "limit"
  | "tangent-normal"
  | "extrema";

export type Exercise = {
  id: string;
  topic: Topic;
  level: number;
  title: string;
  promptLatex: string;
  expectedAnswerLatex: string;
  solutionSteps: string[];
  gradingHints?: string[];
  source?: "static" | "generated";
};
```

Example:

```ts
const exercise: Exercise = {
  id: "tangent-normal-001",
  topic: "tangent-normal",
  level: 5,
  title: "Érintő és normális",
  promptLatex: "f(x)=\\sin(\\ln x), \\quad x_0=1",
  expectedAnswerLatex:
    "\\text{érintő: } y=x-1, \\quad \\text{normális: } y=-x+1",
  solutionSteps: [
    "f(1)=\\sin(\\ln 1)=0",
    "f'(x)=\\cos(\\ln x)\\cdot \\frac{1}{x}",
    "f'(1)=1",
    "Az érintő meredeksége 1.",
    "Érintő: y=x-1",
    "A normális meredeksége -1.",
    "Normális: y=-x+1"
  ],
  gradingHints: [
    "Check whether the student computed f(x0).",
    "Check whether the derivative is correct.",
    "Check whether the normal slope is the negative reciprocal."
  ],
  source: "static"
};
```

---

## Exercise generation strategy

The app should not ask the AI to generate runtime exercises.

Use two local sources:

1. Static exercise bank.
2. Template-based local generators.

### Static exercise bank

Create hand-written exercises in TypeScript or JSON:

```txt
/src/data/staticExercises.ts
```

Good for:

- exam-style examples,
- limits,
- local extrema,
- complex integrals,
- tasks that need carefully checked solutions.

### Template-based generators

Create simple local generators:

```txt
/src/generators/derivativeGenerator.ts
/src/generators/integralGenerator.ts
/src/generators/limitGenerator.ts
/src/generators/tangentNormalGenerator.ts
/src/generators/extremaGenerator.ts
```

The app should use this flow:

```ts
export function getNextExercise(topic: Topic, level: number): Exercise {
  const generator = findGenerator(topic, level);

  if (generator) {
    return generator.generate();
  }

  return pickRandomStaticExercise(topic, level);
}
```

### Example generator: polynomial derivative

```ts
import type { Exercise } from "../types";

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generatePolynomialDerivative(): Exercise {
  const a = randomInt(1, 5);
  const n = randomInt(2, 5);
  const b = randomInt(1, 9);

  return {
    id: crypto.randomUUID(),
    topic: "derivative",
    level: 1,
    title: "Egyszerű deriválás",
    promptLatex: `f(x)=${a}x^${n}+${b}x`,
    expectedAnswerLatex: `f'(x)=${a * n}x^${n - 1}+${b}`,
    solutionSteps: [
      `${a}x^${n} deriváltja ${a * n}x^${n - 1}`,
      `${b}x deriváltja ${b}`,
      `f'(x)=${a * n}x^${n - 1}+${b}`
    ],
    source: "generated"
  };
}
```

---

## Suggested initial exercise bank

Add at least 20 exercises before improving the generator.

### Differentiation

1. `f(x)=x^3+2x`
2. `f(x)=4x^5-3x^2+7`
3. `f(x)=sin x + x^2`
4. `f(x)=ln x`
5. `f(x)=arctan x`
6. `f(x)=sin(ln x)`
7. `f(x)=x^2 ln x`
8. `f(x)=sin(x^2)`

### Integration

1. `∫ x^2 dx`
2. `∫ (3x^2+2x) dx`
3. `∫ sin x dx`
4. `∫ cos x dx`
5. `∫ 1/x dx`
6. `∫ x arctan x dx`
7. `∫_0^1 arctan(sqrt(x)) dx`
8. `∫_0^1 (3e^{2x}-e^x)/(1+e^x) dx`

### Limits

1. `lim_{x->0} sin x / x`
2. `lim_{x->0} x ln x`
3. `lim_{x->0+} (sin x)^x`
4. `lim_{x->0+} (x + sin x)^{tan x}`
5. `lim_{x->3} sin(x^2-2x-3)/(x^2+2x-15)`

### Tangent and normal line

1. `f(x)=arctan(sqrt(x)), x0=1`
2. `f(x)=sin(ln x), x0=1`
3. `y=(arctan(ln x))^2, x0=e`

### Local extrema

1. `f(x)=(15x-21)sqrt(x^5)`
2. `f(x)=1/(x ln^2 x)`

---

## Component structure

```txt
/src
  /components
    AppHeader.tsx
    SettingsPanel.tsx
    TopicSelector.tsx
    DifficultySelector.tsx
    ExerciseView.tsx
    DrawingCanvas.tsx
    DrawingToolbar.tsx
    FeedbackPanel.tsx
    LoadingOverlay.tsx
    ErrorBox.tsx

  /data
    staticExercises.ts

  /generators
    index.ts
    derivativeGenerator.ts
    integralGenerator.ts
    limitGenerator.ts
    tangentNormalGenerator.ts
    extremaGenerator.ts

  /providers
    types.ts
    groqProvider.ts
    geminiProvider.ts
    providerFactory.ts

  /ai
    buildEvaluationPrompt.ts
    parseAiResponse.ts

  /canvas
    exportCanvasImage.ts

  /storage
    apiKeyStorage.ts

  /types
    exercise.ts
    feedback.ts
```

---

## Drawing canvas requirements

### MVP

- Works with mouse, touch, and stylus.
- White background.
- Black pen.
- Clear button.
- Submit exports only the drawing area.
- Canvas should be responsive.
- On mobile/tablet, prevent page scrolling while drawing.

### Later

- Eraser.
- Undo.
- Redo.
- Pen thickness.
- Grid paper background.
- Multiple pages.
- Separate "rough work" and "final answer" boxes.

---

## AI provider abstraction

Create a common interface.

```ts
export type AiProviderName = "groq" | "gemini";

export type AiEvaluationInput = {
  apiKey: string;
  exercise: Exercise;
  imageBase64: string;
};

export type AiEvaluationResult = {
  transcription: string;
  finalAnswer?: string;
  isCorrect: boolean | null;
  score: number;
  feedbackHu: string;
  hintHu?: string;
  fullSolutionHu?: string;
  handwritingUnclear?: boolean;
};
```

Provider interface:

```ts
export interface AiVisionProvider {
  name: AiProviderName;
  evaluate(input: AiEvaluationInput): Promise<AiEvaluationResult>;
}
```

Provider factory:

```ts
export function createProvider(name: AiProviderName): AiVisionProvider {
  switch (name) {
    case "groq":
      return new GroqProvider();
    case "gemini":
      return new GeminiProvider();
    default:
      throw new Error(`Unsupported provider: ${name}`);
  }
}
```

Do not hardcode the API key in the repository.

---

## AI prompt

The prompt should be strict and JSON-oriented.

```txt
You are a Hungarian MAT I tutor.

The student solved the following exercise by handwriting on a canvas image.

Exercise:
{{promptLatex}}

Expected answer:
{{expectedAnswerLatex}}

Expected solution steps:
{{solutionSteps}}

Your tasks:
1. Read and transcribe the student's handwritten solution.
2. Compare it to the expected answer and solution steps.
3. Decide whether the solution is mathematically correct.
4. Be tolerant of notation differences.
5. If the handwriting is unclear, say exactly which part is unclear.
6. Give short Hungarian feedback.
7. Give only one useful hint unless the answer is already complete.
8. Do not invent steps that are not visible in the handwriting.

Return strict JSON only:

{
  "transcription": "string",
  "finalAnswer": "string or empty",
  "isCorrect": true,
  "score": 0,
  "feedbackHu": "string",
  "hintHu": "string",
  "fullSolutionHu": "string",
  "handwritingUnclear": false
}
```

Important:

- `score` must be between 0 and 100.
- `isCorrect` can be `true`, `false`, or `null` if handwriting is too unclear.
- The response must not contain Markdown outside the JSON.

---

## Feedback UI

Display the AI result clearly.

Recommended UI sections:

```txt
Ezt olvastam ki:
<transcription>

Értékelés:
<score>/100

Visszajelzés:
<feedbackHu>

Tipp:
<hintHu>
```

If `handwritingUnclear` is true:

```txt
Nem tudtam biztosan kiolvasni a kézírásod egy részét.
Próbáld meg nagyobb betűkkel vagy külön végső válaszmezőben.
```

The transcription must always be visible so the student can see whether the AI read the handwriting correctly.

---

## Local validation later

The MVP may rely on AI feedback only.

Later, add local mathematical validation for simple cases:

- Compare equivalent derivatives.
- Check integrals by differentiating the submitted answer.
- Check tangent line by testing point and slope.
- Check definite integral as numeric value.
- Check limits by known result or symbolic simplification.

Possible libraries:

- `mathjs`
- `nerdamer`
- `algebrite`

This should not block the MVP.

---

## UI language

The app UI should be Hungarian.

Suggested labels:

```txt
Téma
Nehézség
Új feladat
Beküldés
Törlés
Beállítások
AI szolgáltató
API kulcs
Kulcs megjegyzése ezen az eszközön
Ezt olvastam ki
Értékelés
Tipp
Teljes megoldás
```

---

## Error handling

Handle these cases:

### Missing API key

```txt
Adj meg egy API kulcsot a beküldéshez.
```

### AI request failed

```txt
Az AI kérés nem sikerült. Ellenőrizd az API kulcsot vagy próbáld újra később.
```

### Invalid JSON response

```txt
Az AI válasza nem volt feldolgozható. Próbáld újra.
```

### Empty canvas

```txt
Úgy tűnik, még nem írtál semmit a megoldás mezőbe.
```

### Too large image

```txt
A kép túl nagy. Próbáld törölni és újra beküldeni.
```

---

## Security and privacy notes

Because the MVP is backend-free:

- The user's API key is used directly in the browser.
- The API key must never be committed to the repository.
- The API key should only be saved if the user explicitly enables it.
- The app should clearly explain that the handwritten solution image is sent to the selected AI provider.
- No solution images are stored by the app in the MVP.
- No user account or personal data is required.

Settings text:

```txt
A beküldött kézírásos megoldás képként elküldésre kerül a kiválasztott AI szolgáltatónak.
Az API kulcsodat az app nem küldi saját szerverre, mert nincs backend.
```

---

## Deployment

Target deployment:

```txt
GitHub Pages
```

Recommended build:

```bash
npm install
npm run dev
npm run build
npm run preview
```

For GitHub Pages with Vite, ensure that `base` is configured correctly if deployed under a repository path.

Example:

```ts
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  base: "/handcalc/"
});
```

---

## Acceptance criteria for MVP

The MVP is complete when:

1. The app runs locally with `npm run dev`.
2. The app can be built with `npm run build`.
3. The app can be deployed as static files.
4. The user can select an AI provider.
5. The user can enter an API key.
6. The user can select topic and difficulty.
7. The app shows a rendered math exercise.
8. The user can handwrite a solution on a canvas.
9. The user can clear the canvas.
10. The user can submit the canvas.
11. The app sends the image and exercise context to the selected AI provider.
12. The app displays JSON-based Hungarian feedback.
13. Refresh resets the current exercise and solution without breaking the app.

---

## Suggested implementation order

### Step 1: Project skeleton

- Create Vite React TypeScript app.
- Add basic layout.
- Add topic and difficulty selectors.

### Step 2: Exercise rendering

- Add `Exercise` type.
- Add static exercise bank.
- Add `getNextExercise`.
- Render LaTeX with KaTeX.

### Step 3: Canvas

- Add drawing canvas.
- Support pointer events.
- Add clear button.
- Export canvas as base64 image.

### Step 4: AI provider abstraction

- Add provider interface.
- Add dummy provider returning mock feedback.
- Build feedback panel.

### Step 5: Real provider

- Implement Groq or Gemini provider.
- Add API key input.
- Send image and prompt.
- Parse JSON response.

### Step 6: Polish

- Add loading state.
- Add error states.
- Improve mobile layout.
- Add GitHub Pages deployment config.

---

## Mock provider for development

Before integrating a real AI provider, use a mock.

```ts
export class MockProvider implements AiVisionProvider {
  name = "mock" as const;

  async evaluate(): Promise<AiEvaluationResult> {
    await new Promise(resolve => setTimeout(resolve, 700));

    return {
      transcription: "f'(x)=3x^2+2",
      finalAnswer: "f'(x)=3x^2+2",
      isCorrect: true,
      score: 100,
      feedbackHu: "A megoldás helyesnek tűnik.",
      hintHu: "",
      fullSolutionHu: "",
      handwritingUnclear: false
    };
  }
}
```

Use the mock provider until the UI and canvas flow work.

---

## Future roadmap

### V0.2

- More static exercises.
- Better random generators.
- Eraser.
- Undo.
- Redo.
- Pen width selection.

### V0.3

- Optional handwriting warm-up.
- Send handwriting sample as extra AI context.
- Separate final answer box.
- Optional API key saving.

### V0.4

- Local math validation for simple exercises.
- Better grading.
- Full solution reveal.

### V1.0

- Exam mode.
- Mixed exercises.
- Timer.
- Score summary.
- PWA offline shell.
- Import/export exercise bank.

---

## Coding style preferences

- Keep the first implementation simple.
- Avoid unnecessary architecture.
- Prefer small pure functions.
- Do not add a backend.
- Do not add authentication.
- Do not add a global state library unless needed.
- Keep AI provider code isolated from UI components.
- Keep exercise generation deterministic enough to test.
- Use Hungarian UI text.
- Use English code names and types.

---

## Definition of done

A student can open the deployed static website, enter their own AI API key, solve a MAT I exercise by handwriting, submit it, and receive useful Hungarian feedback from an AI vision model.

The app should remain simple enough that refreshing the page safely restarts everything.
