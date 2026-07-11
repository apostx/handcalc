import type { Exercise } from "../types/exercise";
import { randomInt } from "./util";

// f(x) = x^3 - 3 a^2 x: local max at x = -a with 2a^3, local min at x = a with -2a^3.
function level5(): Exercise {
  const a = randomInt(1, 4);
  const p = 3 * a * a;
  const v = 2 * a * a * a;

  return {
    id: crypto.randomUUID(),
    topic: "extrema",
    level: 5,
    title: "Local extrema",
    promptLatex: `f(x)=x^3-${p}x`,
    expectedAnswerLatex: `\\text{local max at } x=-${a},\\; f(-${a})=${v};\\quad \\text{local min at } x=${a},\\; f(${a})=-${v}`,
    solutionSteps: [
      `f'(x)=3x^2-${p}`,
      `f'(x)=0 \\Rightarrow x^2=${a * a} \\Rightarrow x=\\pm ${a}`,
      `f'>0 \\text{ on } (-\\infty,-${a}),\\; f'<0 \\text{ on } (-${a},${a}),\\; f'>0 \\text{ on } (${a},\\infty)`,
      `\\text{Local maximum at } x=-${a},\\; f(-${a})=${v}`,
      `\\text{Local minimum at } x=${a},\\; f(${a})=-${v}`
    ],
    gradingHints: [
      "Check the sign analysis (or second derivative test) around both critical points.",
      "Check that both extremum locations and values are given."
    ],
    source: "generated"
  };
}

export const extremaGenerator = {
  topic: "extrema" as const,
  levels: [5],
  generate(): Exercise {
    return level5();
  }
};
