type AppHeaderProps = {
  onOpenSettings?: () => void;
};

export function AppHeader({ onOpenSettings }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div>
        <h1>HandCalc Trainer</h1>
        <p className="app-subtitle">Handwritten calculus practice with AI feedback</p>
      </div>
      {onOpenSettings && (
        <button type="button" className="btn btn-ghost" onClick={onOpenSettings}>
          Settings
        </button>
      )}
    </header>
  );
}
