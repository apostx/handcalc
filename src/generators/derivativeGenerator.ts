import type { Exercise } from "../types/exercise";
import { coef, pick, pow, randomInt } from "./util";

function level1(): Exercise {
  const a = randomInt(1, 5);
  const n = randomInt(2, 5);
  const b = randomInt(1, 9);

  return {
    id: crypto.randomUUID(),
    topic: "derivative",
    level: 1,
    title: "Polynomial derivative",
    promptLatex: `f(x)=${coef(a)}${pow(n)}+${b}x`,
    expectedAnswerLatex: `f'(x)=${a * n}${pow(n - 1)}+${b}`,
    solutionSteps: [
      `\\text{The derivative of } ${coef(a)}${pow(n)} \\text{ is } ${a * n}${pow(n - 1)}`,
      `\\text{The derivative of } ${b}x \\text{ is } ${b}`,
      `f'(x)=${a * n}${pow(n - 1)}+${b}`
    ],
    source: "generated"
  };
}

function level2(): Exercise {
  const a = randomInt(2, 5);
  const n = randomInt(2, 4);
  const fn = pick([
    { f: "\\sin x", d: "\\cos x" },
    { f: "\\cos x", d: "-\\sin x" },
    { f: "e^x", d: "e^x" },
    { f: "\\ln x", d: "\\frac{1}{x}" }
  ]);
  const dTerm = fn.d.startsWith("-")
    ? `-${a}${fn.d.slice(1)}`
    : `${a}${fn.d === "\\frac{1}{x}" ? `\\cdot\\frac{1}{x}` : fn.d}`;

  return {
    id: crypto.randomUUID(),
    topic: "derivative",
    level: 2,
    title: "Standard function derivative",
    promptLatex: `f(x)=${a}${fn.f}+${pow(n)}`,
    expectedAnswerLatex: `f'(x)=${dTerm}+${n}${pow(n - 1)}`,
    solutionSteps: [
      `(${fn.f})'=${fn.d}`,
      `(${pow(n)})'=${n}${pow(n - 1)}`,
      `f'(x)=${dTerm}+${n}${pow(n - 1)}`
    ],
    source: "generated"
  };
}

function level3(): Exercise {
  const k = randomInt(2, 5);
  const variant = pick(["sin", "cos", "exp", "ln"] as const);

  if (variant === "ln") {
    const c = randomInt(1, 9);
    return {
      id: crypto.randomUUID(),
      topic: "derivative",
      level: 3,
      title: "Chain rule",
      promptLatex: `f(x)=\\ln(x^2+${c})`,
      expectedAnswerLatex: `f'(x)=\\frac{2x}{x^2+${c}}`,
      solutionSteps: [
        `\\text{Outer: } \\ln u, \\text{ inner: } u=x^2+${c}`,
        `f'(x)=\\frac{1}{x^2+${c}}\\cdot 2x=\\frac{2x}{x^2+${c}}`
      ],
      source: "generated"
    };
  }

  const table = {
    sin: {
      prompt: `\\sin(${k}x)`,
      answer: `${k}\\cos(${k}x)`,
      outer: "\\sin u"
    },
    cos: {
      prompt: `\\cos(${k}x)`,
      answer: `-${k}\\sin(${k}x)`,
      outer: "\\cos u"
    },
    exp: {
      prompt: `e^{${k}x}`,
      answer: `${k}e^{${k}x}`,
      outer: "e^u"
    }
  }[variant];

  return {
    id: crypto.randomUUID(),
    topic: "derivative",
    level: 3,
    title: "Chain rule",
    promptLatex: `f(x)=${table.prompt}`,
    expectedAnswerLatex: `f'(x)=${table.answer}`,
    solutionSteps: [
      `\\text{Outer: } ${table.outer}, \\text{ inner: } u=${k}x`,
      `f'(x)=${table.answer}`
    ],
    source: "generated"
  };
}

function level4(): Exercise {
  const n = randomInt(2, 4);
  return {
    id: crypto.randomUUID(),
    topic: "derivative",
    level: 4,
    title: "Product rule",
    promptLatex: `f(x)=${pow(n)}\\ln x`,
    expectedAnswerLatex: `f'(x)=${n}${pow(n - 1)}\\ln x+${pow(n - 1)}`,
    solutionSteps: [
      "\\text{Product rule: } (uv)'=u'v+uv'",
      `u=${pow(n)},\\; v=\\ln x`,
      `f'(x)=${n}${pow(n - 1)}\\ln x+${pow(n)}\\cdot\\frac{1}{x}`,
      `f'(x)=${n}${pow(n - 1)}\\ln x+${pow(n - 1)}`
    ],
    source: "generated"
  };
}

export const derivativeGenerator = {
  topic: "derivative" as const,
  levels: [1, 2, 3, 4],
  generate(level: number): Exercise {
    switch (level) {
      case 1:
        return level1();
      case 2:
        return level2();
      case 3:
        return level3();
      default:
        return level4();
    }
  }
};
