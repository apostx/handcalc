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

export const TOPIC_LABELS: Record<Topic, string> = {
  derivative: "Differentiation",
  integral: "Integration",
  limit: "Limits",
  "tangent-normal": "Tangent and normal line",
  extrema: "Local extrema"
};

export const LEVEL_LABELS: Record<number, string> = {
  1: "Basics",
  2: "Standard functions",
  3: "Chain rule / substitution",
  4: "Product / quotient / harder limits",
  5: "Exam style"
};

export const ALL_TOPICS: Topic[] = [
  "derivative",
  "integral",
  "limit",
  "tangent-normal",
  "extrema"
];

export const ALL_LEVELS = [1, 2, 3, 4, 5];
