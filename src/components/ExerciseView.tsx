import { LEVEL_LABELS, TOPIC_LABELS, type Exercise } from "../types/exercise";
import { Latex } from "./Latex";

type ExerciseViewProps = {
  exercise: Exercise;
};

export function ExerciseView({ exercise }: ExerciseViewProps) {
  return (
    <section className="exercise-view">
      <div className="exercise-meta">
        <span className="badge">{TOPIC_LABELS[exercise.topic]}</span>
        <span className="badge badge-muted">
          Level {exercise.level} – {LEVEL_LABELS[exercise.level] ?? ""}
        </span>
      </div>
      <h2 className="exercise-title">{exercise.title}</h2>
      <div className="exercise-prompt">
        <Latex tex={exercise.promptLatex} block />
      </div>
    </section>
  );
}
