import type { Exercise } from "../types/exercise";

export function buildEvaluationPrompt(exercise: Exercise): string {
  const steps = exercise.solutionSteps.map(s => `- ${s}`).join("\n");
  const hints = exercise.gradingHints?.length
    ? `\nGrading hints:\n${exercise.gradingHints.map(h => `- ${h}`).join("\n")}\n`
    : "";

  return `You are a university calculus (MAT I) tutor.

The student solved the following exercise by handwriting on a canvas. The attached image shows the handwritten solution.

Exercise (LaTeX):
${exercise.promptLatex}

Expected answer (LaTeX):
${exercise.expectedAnswerLatex}

Expected solution steps (LaTeX):
${steps}
${hints}
Your tasks:
1. Read and transcribe the student's handwritten solution.
2. Compare it to the expected answer and solution steps.
3. Decide whether the solution is mathematically correct.
4. Be tolerant of notation differences and algebraically equivalent forms.
5. If the handwriting is unclear, say exactly which part is unclear.
6. Give short feedback in English.
7. Give only one useful hint unless the answer is already complete.
8. Do not invent steps that are not visible in the handwriting.

Return strict JSON only, no Markdown, no code fences:

{
  "transcription": "what you read from the handwriting",
  "finalAnswer": "the student's final answer, or empty string",
  "isCorrect": true | false | null,
  "score": 0-100,
  "feedback": "short English feedback",
  "hint": "one short hint, or empty string",
  "fullSolution": "short English walkthrough of the correct solution, or empty string",
  "handwritingUnclear": true | false
}

Rules:
- "score" must be an integer between 0 and 100.
- "isCorrect" must be null if the handwriting is too unclear to judge.
- The response must contain nothing outside the JSON object.`;
}
