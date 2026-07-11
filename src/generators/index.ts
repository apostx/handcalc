import type { Exercise, Topic } from "../types/exercise";
import { pickRandomStaticExercise } from "../data/staticExercises";
import { derivativeGenerator } from "./derivativeGenerator";
import { integralGenerator } from "./integralGenerator";
import { limitGenerator } from "./limitGenerator";
import { tangentNormalGenerator } from "./tangentNormalGenerator";
import { extremaGenerator } from "./extremaGenerator";

export type ExerciseGenerator = {
  topic: Topic;
  levels: number[];
  generate(level: number): Exercise;
};

const generators: ExerciseGenerator[] = [
  derivativeGenerator,
  integralGenerator,
  limitGenerator,
  tangentNormalGenerator,
  extremaGenerator
];

export function findGenerator(
  topic: Topic,
  level: number
): ExerciseGenerator | undefined {
  return generators.find(g => g.topic === topic && g.levels.includes(level));
}

export function getNextExercise(topic: Topic, level: number): Exercise {
  const generator = findGenerator(topic, level);

  // Mix generated and static exercises when both are available.
  if (generator && Math.random() < 0.5) {
    return generator.generate(level);
  }

  try {
    return pickRandomStaticExercise(topic, level);
  } catch {
    if (generator) {
      return generator.generate(level);
    }
    throw new Error(`No exercise available for ${topic} level ${level}`);
  }
}
