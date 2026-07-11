import type { Exercise } from "../types/exercise";
import { randomInt } from "./util";

// f(x) = x^2 + a x at x0 = 1: f(1) = 1 + a, f'(1) = 2 + a (never zero for a >= 1).
function level5(): Exercise {
  const a = randomInt(1, 6);
  const y0 = 1 + a;
  const m = 2 + a;

  return {
    id: crypto.randomUUID(),
    topic: "tangent-normal",
    level: 5,
    title: "Tangent and normal line",
    promptLatex: `f(x)=x^2+${a}x,\\quad x_0=1`,
    expectedAnswerLatex: `\\text{tangent: } y=${y0}+${m}(x-1),\\quad \\text{normal: } y=${y0}-\\frac{1}{${m}}(x-1)`,
    solutionSteps: [
      `f(1)=1+${a}=${y0}`,
      `f'(x)=2x+${a}`,
      `f'(1)=${m}`,
      `\\text{Tangent: } y=${y0}+${m}(x-1)`,
      `\\text{Normal slope: } -\\frac{1}{${m}}`,
      `\\text{Normal: } y=${y0}-\\frac{1}{${m}}(x-1)`
    ],
    gradingHints: [
      "Check whether the student computed f(x0).",
      "Check whether the derivative is correct.",
      "Check whether the normal slope is the negative reciprocal."
    ],
    source: "generated"
  };
}

export const tangentNormalGenerator = {
  topic: "tangent-normal" as const,
  levels: [5],
  generate(): Exercise {
    return level5();
  }
};
