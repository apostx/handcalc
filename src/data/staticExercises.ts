import type { Exercise } from "../types/exercise";

// Hand-checked exercise bank. Every solutionSteps entry is a KaTeX-renderable
// LaTeX string; prose goes inside \text{...}.
export const staticExercises: Exercise[] = [
  // ---------------------------------------------------------------- derivative
  {
    id: "derivative-001",
    topic: "derivative",
    level: 1,
    title: "Polynomial derivative",
    promptLatex: "f(x)=x^3+2x",
    expectedAnswerLatex: "f'(x)=3x^2+2",
    solutionSteps: [
      "\\text{The derivative of } x^3 \\text{ is } 3x^2",
      "\\text{The derivative of } 2x \\text{ is } 2",
      "f'(x)=3x^2+2"
    ],
    source: "static"
  },
  {
    id: "derivative-002",
    topic: "derivative",
    level: 1,
    title: "Polynomial derivative",
    promptLatex: "f(x)=4x^5-3x^2+7",
    expectedAnswerLatex: "f'(x)=20x^4-6x",
    solutionSteps: [
      "\\text{Apply the power rule term by term.}",
      "(4x^5)'=20x^4",
      "(-3x^2)'=-6x",
      "(7)'=0",
      "f'(x)=20x^4-6x"
    ],
    source: "static"
  },
  {
    id: "derivative-003",
    topic: "derivative",
    level: 2,
    title: "Sine plus power",
    promptLatex: "f(x)=\\sin x + x^2",
    expectedAnswerLatex: "f'(x)=\\cos x + 2x",
    solutionSteps: [
      "(\\sin x)'=\\cos x",
      "(x^2)'=2x",
      "f'(x)=\\cos x + 2x"
    ],
    source: "static"
  },
  {
    id: "derivative-004",
    topic: "derivative",
    level: 2,
    title: "Natural logarithm",
    promptLatex: "f(x)=\\ln x",
    expectedAnswerLatex: "f'(x)=\\frac{1}{x}",
    solutionSteps: ["(\\ln x)'=\\frac{1}{x}"],
    source: "static"
  },
  {
    id: "derivative-005",
    topic: "derivative",
    level: 2,
    title: "Arctangent",
    promptLatex: "f(x)=\\arctan x",
    expectedAnswerLatex: "f'(x)=\\frac{1}{1+x^2}",
    solutionSteps: ["(\\arctan x)'=\\frac{1}{1+x^2}"],
    source: "static"
  },
  {
    id: "derivative-006",
    topic: "derivative",
    level: 3,
    title: "Chain rule with logarithm",
    promptLatex: "f(x)=\\sin(\\ln x)",
    expectedAnswerLatex: "f'(x)=\\frac{\\cos(\\ln x)}{x}",
    solutionSteps: [
      "\\text{Outer function } \\sin u, \\text{ inner function } u=\\ln x",
      "f'(x)=\\cos(\\ln x)\\cdot(\\ln x)'",
      "f'(x)=\\cos(\\ln x)\\cdot\\frac{1}{x}"
    ],
    gradingHints: [
      "Check whether the chain rule was applied (factor 1/x present)."
    ],
    source: "static"
  },
  {
    id: "derivative-007",
    topic: "derivative",
    level: 4,
    title: "Product rule",
    promptLatex: "f(x)=x^2\\ln x",
    expectedAnswerLatex: "f'(x)=2x\\ln x + x",
    solutionSteps: [
      "\\text{Product rule: } (uv)'=u'v+uv'",
      "u=x^2,\\; v=\\ln x",
      "f'(x)=2x\\ln x + x^2\\cdot\\frac{1}{x}",
      "f'(x)=2x\\ln x + x"
    ],
    source: "static"
  },
  {
    id: "derivative-008",
    topic: "derivative",
    level: 3,
    title: "Chain rule with power",
    promptLatex: "f(x)=\\sin(x^2)",
    expectedAnswerLatex: "f'(x)=2x\\cos(x^2)",
    solutionSteps: [
      "\\text{Outer function } \\sin u, \\text{ inner function } u=x^2",
      "f'(x)=\\cos(x^2)\\cdot 2x"
    ],
    source: "static"
  },

  // ------------------------------------------------------------------ integral
  {
    id: "integral-001",
    topic: "integral",
    level: 1,
    title: "Power integral",
    promptLatex: "\\int x^2\\,dx",
    expectedAnswerLatex: "\\frac{x^3}{3}+C",
    solutionSteps: [
      "\\int x^n\\,dx=\\frac{x^{n+1}}{n+1}+C",
      "\\int x^2\\,dx=\\frac{x^3}{3}+C"
    ],
    source: "static"
  },
  {
    id: "integral-002",
    topic: "integral",
    level: 1,
    title: "Polynomial integral",
    promptLatex: "\\int (3x^2+2x)\\,dx",
    expectedAnswerLatex: "x^3+x^2+C",
    solutionSteps: [
      "\\int 3x^2\\,dx=x^3",
      "\\int 2x\\,dx=x^2",
      "\\int (3x^2+2x)\\,dx=x^3+x^2+C"
    ],
    source: "static"
  },
  {
    id: "integral-003",
    topic: "integral",
    level: 2,
    title: "Sine integral",
    promptLatex: "\\int \\sin x\\,dx",
    expectedAnswerLatex: "-\\cos x+C",
    solutionSteps: ["\\int \\sin x\\,dx=-\\cos x+C"],
    source: "static"
  },
  {
    id: "integral-004",
    topic: "integral",
    level: 2,
    title: "Cosine integral",
    promptLatex: "\\int \\cos x\\,dx",
    expectedAnswerLatex: "\\sin x+C",
    solutionSteps: ["\\int \\cos x\\,dx=\\sin x+C"],
    source: "static"
  },
  {
    id: "integral-005",
    topic: "integral",
    level: 2,
    title: "Reciprocal integral",
    promptLatex: "\\int \\frac{1}{x}\\,dx",
    expectedAnswerLatex: "\\ln|x|+C",
    solutionSteps: ["\\int \\frac{1}{x}\\,dx=\\ln|x|+C"],
    source: "static"
  },
  {
    id: "integral-006",
    topic: "integral",
    level: 4,
    title: "Integration by parts",
    promptLatex: "\\int x\\arctan x\\,dx",
    expectedAnswerLatex: "\\frac{x^2+1}{2}\\arctan x-\\frac{x}{2}+C",
    solutionSteps: [
      "\\text{By parts: } u=\\arctan x,\\; dv=x\\,dx",
      "\\int x\\arctan x\\,dx=\\frac{x^2}{2}\\arctan x-\\frac{1}{2}\\int\\frac{x^2}{1+x^2}\\,dx",
      "\\int\\frac{x^2}{1+x^2}\\,dx=\\int\\left(1-\\frac{1}{1+x^2}\\right)dx=x-\\arctan x",
      "\\int x\\arctan x\\,dx=\\frac{x^2}{2}\\arctan x-\\frac{x}{2}+\\frac{\\arctan x}{2}+C",
      "=\\frac{x^2+1}{2}\\arctan x-\\frac{x}{2}+C"
    ],
    gradingHints: [
      "Accept algebraically equivalent forms of the antiderivative.",
      "The constant C may be missing; mention it but do not fail the solution for it alone."
    ],
    source: "static"
  },
  {
    id: "integral-007",
    topic: "integral",
    level: 5,
    title: "Definite integral with substitution",
    promptLatex: "\\int_0^1 \\arctan(\\sqrt{x})\\,dx",
    expectedAnswerLatex: "\\frac{\\pi}{2}-1",
    solutionSteps: [
      "\\text{Substitute } t=\\sqrt{x},\\; x=t^2,\\; dx=2t\\,dt",
      "\\int_0^1 \\arctan(\\sqrt{x})\\,dx=\\int_0^1 2t\\arctan t\\,dt",
      "\\text{By parts: } \\int 2t\\arctan t\\,dt=t^2\\arctan t-\\int\\frac{t^2}{1+t^2}\\,dt",
      "\\int_0^1\\frac{t^2}{1+t^2}\\,dt=1-\\frac{\\pi}{4}",
      "\\left[t^2\\arctan t\\right]_0^1=\\frac{\\pi}{4}",
      "\\text{Result: } \\frac{\\pi}{4}-\\left(1-\\frac{\\pi}{4}\\right)=\\frac{\\pi}{2}-1"
    ],
    source: "static"
  },
  {
    id: "integral-008",
    topic: "integral",
    level: 5,
    title: "Definite integral with exponential substitution",
    promptLatex: "\\int_0^1 \\frac{3e^{2x}-e^x}{1+e^x}\\,dx",
    expectedAnswerLatex: "3e-3-4\\ln\\frac{1+e}{2}",
    solutionSteps: [
      "\\text{Substitute } u=e^x,\\; du=e^x\\,dx,\\; dx=\\frac{du}{u}",
      "\\frac{3u^2-u}{1+u}\\cdot\\frac{1}{u}=\\frac{3u-1}{1+u}=3-\\frac{4}{1+u}",
      "\\int\\left(3-\\frac{4}{1+u}\\right)du=3u-4\\ln(1+u)",
      "\\text{Limits: } x=0\\Rightarrow u=1,\\; x=1\\Rightarrow u=e",
      "\\left[3u-4\\ln(1+u)\\right]_1^e=3e-4\\ln(1+e)-3+4\\ln 2",
      "=3e-3-4\\ln\\frac{1+e}{2}"
    ],
    source: "static"
  },

  // --------------------------------------------------------------------- limit
  {
    id: "limit-001",
    topic: "limit",
    level: 2,
    title: "Classic sine limit",
    promptLatex: "\\lim_{x\\to 0}\\frac{\\sin x}{x}",
    expectedAnswerLatex: "1",
    solutionSteps: ["\\text{Known limit: } \\lim_{x\\to 0}\\frac{\\sin x}{x}=1"],
    source: "static"
  },
  {
    id: "limit-002",
    topic: "limit",
    level: 4,
    title: "Logarithmic limit",
    promptLatex: "\\lim_{x\\to 0^+} x\\ln x",
    expectedAnswerLatex: "0",
    solutionSteps: [
      "\\text{Rewrite: } x\\ln x=\\frac{\\ln x}{1/x}",
      "\\text{L'Hôpital: } \\frac{1/x}{-1/x^2}=-x",
      "\\lim_{x\\to 0^+}(-x)=0"
    ],
    source: "static"
  },
  {
    id: "limit-003",
    topic: "limit",
    level: 5,
    title: "Power form limit",
    promptLatex: "\\lim_{x\\to 0^+} (\\sin x)^x",
    expectedAnswerLatex: "1",
    solutionSteps: [
      "(\\sin x)^x=e^{x\\ln\\sin x}",
      "x\\ln\\sin x=x\\ln\\frac{\\sin x}{x}+x\\ln x",
      "\\lim_{x\\to 0^+}x\\ln\\frac{\\sin x}{x}=0,\\quad \\lim_{x\\to 0^+}x\\ln x=0",
      "\\text{Result: } e^0=1"
    ],
    source: "static"
  },
  {
    id: "limit-004",
    topic: "limit",
    level: 5,
    title: "Power form limit",
    promptLatex: "\\lim_{x\\to 0^+} (x+\\sin x)^{\\tan x}",
    expectedAnswerLatex: "1",
    solutionSteps: [
      "(x+\\sin x)^{\\tan x}=e^{\\tan x\\cdot\\ln(x+\\sin x)}",
      "\\tan x\\sim x,\\quad x+\\sin x\\sim 2x \\text{ as } x\\to 0^+",
      "\\tan x\\cdot\\ln(x+\\sin x)\\sim x\\ln(2x)=x\\ln 2+x\\ln x\\to 0",
      "\\text{Result: } e^0=1"
    ],
    source: "static"
  },
  {
    id: "limit-005",
    topic: "limit",
    level: 4,
    title: "0/0 limit with factoring",
    promptLatex: "\\lim_{x\\to 3}\\frac{\\sin(x^2-2x-3)}{x^2+2x-15}",
    expectedAnswerLatex: "\\frac{1}{2}",
    solutionSteps: [
      "x^2-2x-3=(x-3)(x+1),\\quad x^2+2x-15=(x-3)(x+5)",
      "\\frac{\\sin((x-3)(x+1))}{(x-3)(x+5)}=\\frac{\\sin((x-3)(x+1))}{(x-3)(x+1)}\\cdot\\frac{x+1}{x+5}",
      "\\text{First factor} \\to 1, \\text{ second factor} \\to \\frac{4}{8}=\\frac{1}{2}"
    ],
    source: "static"
  },

  // ------------------------------------------------------------ tangent-normal
  {
    id: "tangent-normal-001",
    topic: "tangent-normal",
    level: 5,
    title: "Tangent and normal line",
    promptLatex: "f(x)=\\arctan(\\sqrt{x}),\\quad x_0=1",
    expectedAnswerLatex:
      "\\text{tangent: } y=\\frac{\\pi}{4}+\\frac{1}{4}(x-1),\\quad \\text{normal: } y=\\frac{\\pi}{4}-4(x-1)",
    solutionSteps: [
      "f(1)=\\arctan 1=\\frac{\\pi}{4}",
      "f'(x)=\\frac{1}{1+x}\\cdot\\frac{1}{2\\sqrt{x}}",
      "f'(1)=\\frac{1}{2}\\cdot\\frac{1}{2}=\\frac{1}{4}",
      "\\text{Tangent: } y=\\frac{\\pi}{4}+\\frac{1}{4}(x-1)",
      "\\text{Normal slope: } -\\frac{1}{f'(1)}=-4",
      "\\text{Normal: } y=\\frac{\\pi}{4}-4(x-1)"
    ],
    gradingHints: [
      "Check whether the student computed f(x0).",
      "Check whether the derivative is correct.",
      "Check whether the normal slope is the negative reciprocal."
    ],
    source: "static"
  },
  {
    id: "tangent-normal-002",
    topic: "tangent-normal",
    level: 5,
    title: "Tangent and normal line",
    promptLatex: "f(x)=\\sin(\\ln x),\\quad x_0=1",
    expectedAnswerLatex:
      "\\text{tangent: } y=x-1,\\quad \\text{normal: } y=-x+1",
    solutionSteps: [
      "f(1)=\\sin(\\ln 1)=0",
      "f'(x)=\\cos(\\ln x)\\cdot\\frac{1}{x}",
      "f'(1)=1",
      "\\text{Tangent: } y=x-1",
      "\\text{Normal slope: } -1",
      "\\text{Normal: } y=-x+1"
    ],
    gradingHints: [
      "Check whether the student computed f(x0).",
      "Check whether the derivative is correct.",
      "Check whether the normal slope is the negative reciprocal."
    ],
    source: "static"
  },
  {
    id: "tangent-normal-003",
    topic: "tangent-normal",
    level: 5,
    title: "Tangent line of a composite function",
    promptLatex: "y=(\\arctan(\\ln x))^2,\\quad x_0=e",
    expectedAnswerLatex:
      "\\text{tangent: } y=\\frac{\\pi^2}{16}+\\frac{\\pi}{4e}(x-e)",
    solutionSteps: [
      "y(e)=(\\arctan 1)^2=\\left(\\frac{\\pi}{4}\\right)^2=\\frac{\\pi^2}{16}",
      "y'=2\\arctan(\\ln x)\\cdot\\frac{1}{1+\\ln^2 x}\\cdot\\frac{1}{x}",
      "y'(e)=2\\cdot\\frac{\\pi}{4}\\cdot\\frac{1}{2}\\cdot\\frac{1}{e}=\\frac{\\pi}{4e}",
      "\\text{Tangent: } y=\\frac{\\pi^2}{16}+\\frac{\\pi}{4e}(x-e)"
    ],
    source: "static"
  },

  // ------------------------------------------------------------------- extrema
  {
    id: "extrema-001",
    topic: "extrema",
    level: 5,
    title: "Local extrema",
    promptLatex: "f(x)=(15x-21)\\sqrt{x^5}",
    expectedAnswerLatex:
      "\\text{local minimum at } x=1,\\; f(1)=-6",
    solutionSteps: [
      "f(x)=15x^{7/2}-21x^{5/2},\\quad x\\ge 0",
      "f'(x)=\\frac{105}{2}x^{5/2}-\\frac{105}{2}x^{3/2}=\\frac{105}{2}x^{3/2}(x-1)",
      "f'(x)=0 \\Rightarrow x=0 \\text{ or } x=1",
      "f'<0 \\text{ on } (0,1),\\; f'>0 \\text{ on } (1,\\infty)",
      "\\text{Local minimum at } x=1,\\; f(1)=15-21=-6"
    ],
    gradingHints: [
      "Check whether the domain restriction x >= 0 was noticed.",
      "Check the sign analysis of the derivative around the critical point."
    ],
    source: "static"
  },
  {
    id: "extrema-002",
    topic: "extrema",
    level: 5,
    title: "Local extrema",
    promptLatex: "f(x)=\\frac{1}{x\\ln^2 x}",
    expectedAnswerLatex:
      "\\text{local minimum at } x=e^{-2},\\; f(e^{-2})=\\frac{e^2}{4}",
    solutionSteps: [
      "\\text{Domain: } x>0,\\; x\\neq 1",
      "f'(x)=-\\frac{\\ln^2 x+2\\ln x}{x^2\\ln^4 x}=-\\frac{\\ln x+2}{x^2\\ln^3 x}",
      "f'(x)=0 \\Rightarrow \\ln x=-2 \\Rightarrow x=e^{-2}",
      "f'<0 \\text{ on } (0,e^{-2}),\\; f'>0 \\text{ on } (e^{-2},1)",
      "\\text{Local minimum at } x=e^{-2},\\; f(e^{-2})=\\frac{e^2}{4}"
    ],
    source: "static"
  }
];

export function pickRandomStaticExercise(
  topic: Exercise["topic"],
  level: number
): Exercise {
  const exact = staticExercises.filter(
    e => e.topic === topic && e.level === level
  );
  if (exact.length > 0) {
    return exact[Math.floor(Math.random() * exact.length)];
  }

  // No exercise at this exact level: fall back to the closest level in topic.
  const sameTopic = staticExercises.filter(e => e.topic === topic);
  if (sameTopic.length === 0) {
    throw new Error(`No exercises available for topic: ${topic}`);
  }
  const closest = sameTopic.reduce((best, e) =>
    Math.abs(e.level - level) < Math.abs(best.level - level) ? e : best
  );
  const closestLevel = sameTopic.filter(e => e.level === closest.level);
  return closestLevel[Math.floor(Math.random() * closestLevel.length)];
}
