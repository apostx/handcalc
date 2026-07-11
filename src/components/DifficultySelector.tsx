import { ALL_LEVELS, LEVEL_LABELS } from "../types/exercise";

type DifficultySelectorProps = {
  value: number;
  onChange: (level: number) => void;
};

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <label className="field">
      <span className="field-label">Difficulty</span>
      <select value={value} onChange={e => onChange(Number(e.target.value))}>
        {ALL_LEVELS.map(level => (
          <option key={level} value={level}>
            Level {level} – {LEVEL_LABELS[level]}
          </option>
        ))}
      </select>
    </label>
  );
}
