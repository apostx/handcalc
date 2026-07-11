type ErrorBoxProps = {
  message: string;
  onDismiss?: () => void;
};

export function ErrorBox({ message, onDismiss }: ErrorBoxProps) {
  return (
    <div className="error-box" role="alert">
      <span>{message}</span>
      {onDismiss && (
        <button type="button" className="btn btn-ghost" onClick={onDismiss}>
          ✕
        </button>
      )}
    </div>
  );
}
