import type { Exercise } from "../types/exercise";
import { randomInt } from "./util";

function level1(): Exercise {
  const a = randomInt(1, 5);
  const b = randomInt(1, 9);
  const c = randomInt(1, 3);
  const value = c * c + a * c + b;

  return {
    id: crypto.randomUUID(),
    topic: "limit",
    level: 1,
    title: "Direct substitution limit",
    promptLatex: `\\lim_{x\\to ${c}}\\left(x^2+${a}x+${b}\\right)`,
    expectedAnswerLatex: `${value}`,
    solutionSteps: [
      "\\text{The function is continuous, substitute directly.}",
      `${c}^2+${a}\\cdot ${c}+${b}=${value}`
    ],
    source: "generated"
  };
}

function level2(): Exercise {
  const k = randomInt(2, 6);
  return {
    id: crypto.randomUUID(),
    topic: "limit",
    level: 2,
    title: "Sine limit",
    promptLatex: `\\lim_{x\\to 0}\\frac{\\sin(${k}x)}{x}`,
    expectedAnswerLatex: `${k}`,
    solutionSteps: [
      `\\frac{\\sin(${k}x)}{x}=${k}\\cdot\\frac{\\sin(${k}x)}{${k}x}`,
      `\\lim_{t\\to 0}\\frac{\\sin t}{t}=1`,
      `\\text{Result: } ${k}`
    ],
    source: "generated"
  };
}

function level4(): Exercise {
  const a = randomInt(1, 5);
  return {
    id: crypto.randomUUID(),
    topic: "limit",
    level: 4,
    title: "0/0 limit with factoring",
    promptLatex: `\\lim_{x\\to ${a}}\\frac{x^2-${a * a}}{x-${a}}`,
    expectedAnswerLatex: `${2 * a}`,
    solutionSteps: [
      `x^2-${a * a}=(x-${a})(x+${a})`,
      `\\frac{(x-${a})(x+${a})}{x-${a}}=x+${a}`,
      `\\lim_{x\\to ${a}}(x+${a})=${2 * a}`
    ],
    source: "generated"
  };
}

export const limitGenerator = {
  topic: "limit" as const,
  levels: [1, 2, 4],
  generate(level: number): Exercise {
    switch (level) {
      case 1:
        return level1();
      case 2:
        return level2();
      default:
        return level4();
    }
  }
};
