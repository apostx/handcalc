import { ALL_TOPICS, TOPIC_LABELS, type Topic } from "../types/exercise";

type TopicSelectorProps = {
  value: Topic;
  onChange: (topic: Topic) => void;
};

export function TopicSelector({ value, onChange }: TopicSelectorProps) {
  return (
    <label className="field">
      <span className="field-label">Topic</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value as Topic)}
      >
        {ALL_TOPICS.map(topic => (
          <option key={topic} value={topic}>
            {TOPIC_LABELS[topic]}
          </option>
        ))}
      </select>
    </label>
  );
}
