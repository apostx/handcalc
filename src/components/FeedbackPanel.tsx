import type { Exercise } from "../types/exercise";
import type { AiEvaluationResult } from "../types/feedback";
import { Latex } from "./Latex";

type FeedbackPanelProps = {
  result: AiEvaluationResult;
  exercise: Exercise;
};

function correctnessBadge(isCorrect: boolean | null) {
  if (isCorrect === true) return <span className="badge badge-ok">Correct</span>;
  if (isCorrect === false)
    return <span className="badge badge-bad">Incorrect</span>;
  return <span className="badge badge-muted">Could not judge</span>;
}

export function FeedbackPanel({ result, exercise }: FeedbackPanelProps) {
  return (
    <section className="feedback-panel">
      <div className="feedback-head">
        <h3>Evaluation</h3>
        {correctnessBadge(result.isCorrect)}
        <span className="score">{result.score}/100</span>
      </div>

      {result.handwritingUnclear && (
        <p className="unclear-note">
          I couldn't read part of your handwriting with confidence. Try writing
          larger, or put your final answer on a separate line.
        </p>
      )}

      <h4>What I read</h4>
      <p className="transcription">{result.transcription || "—"}</p>

      {result.finalAnswer ? (
        <>
          <h4>Your final answer</h4>
          <p className="transcription">{result.finalAnswer}</p>
        </>
      ) : null}

      <h4>Feedback</h4>
      <p>{result.feedback || "—"}</p>

      {result.hint ? (
        <>
          <h4>Hint</h4>
          <p>{result.hint}</p>
        </>
      ) : null}

      <details className="full-solution">
        <summary>Show full solution</summary>
        <div className="full-solution-body">
          {result.fullSolution ? <p>{result.fullSolution}</p> : null}
          <p className="solution-label">Expected answer:</p>
          <Latex tex={exercise.expectedAnswerLatex} block />
          <p className="solution-label">Solution steps:</p>
          <ol className="solution-steps">
            {exercise.solutionSteps.map((step, i) => (
              <li key={i}>
                <Latex tex={step} />
              </li>
            ))}
          </ol>
        </div>
      </details>
    </section>
  );
}
