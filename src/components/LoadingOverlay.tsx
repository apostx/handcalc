export function LoadingOverlay() {
  return (
    <div className="loading-overlay" role="status">
      <div className="spinner" />
      <p>The AI is reading your solution…</p>
    </div>
  );
}
