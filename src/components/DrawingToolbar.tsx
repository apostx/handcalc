import type { DrawingTool } from "./DrawingCanvas";

type DrawingToolbarProps = {
  tool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onClear: () => void;
};

export function DrawingToolbar({
  tool,
  onToolChange,
  onClear
}: DrawingToolbarProps) {
  return (
    <div className="drawing-toolbar">
      <button
        type="button"
        className={`btn btn-tool ${tool === "pen" ? "btn-tool-active" : ""}`}
        onClick={() => onToolChange("pen")}
      >
        ✏️ Pen
      </button>
      <button
        type="button"
        className={`btn btn-tool ${tool === "eraser" ? "btn-tool-active" : ""}`}
        onClick={() => onToolChange("eraser")}
      >
        🧽 Eraser
      </button>
      <button type="button" className="btn btn-tool" onClick={onClear}>
        🗑️ Clear
      </button>
    </div>
  );
}
