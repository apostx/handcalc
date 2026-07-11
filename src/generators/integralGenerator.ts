import type { Exercise } from "../types/exercise";
import { coef, pick, randomInt } from "./util";

function level1(): Exercise {
  const n = randomInt(2, 4);
  const c = randomInt(1, 4);
  const a = c * (n + 1); // keeps the antiderivative coefficient an integer
  const b = randomInt(1, 9);

  return {
    id: crypto.randomUUID(),
    topic: "integral",
    level: 1,
    title: "Polynomial integral",
    promptLatex: `\\int (${a}x^{${n}}+${b})\\,dx`,
    expectedAnswerLatex: `${coef(c)}x^{${n + 1}}+${b}x+C`,
    solutionSteps: [
      `\\int ${a}x^{${n}}\\,dx=\\frac{${a}}{${n + 1}}x^{${n + 1}}=${coef(c)}x^{${n + 1}}`,
      `\\int ${b}\\,dx=${b}x`,
      `${coef(c)}x^{${n + 1}}+${b}x+C`
    ],
    source: "generated"
  };
}

function level2(): Exercise {
  const a = randomInt(2, 6);
  const fn = pick([
    { f: "\\sin x", F: `-${a}\\cos x` },
    { f: "\\cos x", F: `${a}\\sin x` },
    { f: "e^x", F: `${a}e^x` },
    { f: "\\frac{1}{x}", F: `${a}\\ln|x|` }
  ]);

  return {
    id: crypto.randomUUID(),
    topic: "integral",
    level: 2,
    title: "Standard function integral",
    promptLatex: `\\int ${a}${fn.f}\\,dx`,
    expectedAnswerLatex: `${fn.F}+C`,
    solutionSteps: [
      `\\text{The constant factor moves outside the integral.}`,
      `\\int ${a}${fn.f}\\,dx=${fn.F}+C`
    ],
    source: "generated"
  };
}

function level3(): Exercise {
  const k = randomInt(2, 5);
  const fn = pick([
    { f: `\\cos(${k}x)`, F: `\\frac{\\sin(${k}x)}{${k}}` },
    { f: `\\sin(${k}x)`, F: `-\\frac{\\cos(${k}x)}{${k}}` },
    { f: `e^{${k}x}`, F: `\\frac{e^{${k}x}}{${k}}` }
  ]);

  return {
    id: crypto.randomUUID(),
    topic: "integral",
    level: 3,
    title: "Linear substitution integral",
    promptLatex: `\\int ${fn.f}\\,dx`,
    expectedAnswerLatex: `${fn.F}+C`,
    solutionSteps: [
      `\\text{Linear inner function } ${k}x \\text{ brings a factor } \\frac{1}{${k}}`,
      `\\int ${fn.f}\\,dx=${fn.F}+C`
    ],
    source: "generated"
  };
}

export const integralGenerator = {
  topic: "integral" as const,
  levels: [1, 2, 3],
  generate(level: number): Exercise {
    switch (level) {
      case 1:
        return level1();
      case 2:
        return level2();
      default:
        return level3();
    }
  }
};
