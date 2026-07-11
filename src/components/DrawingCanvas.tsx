import {
  useEffect,
  useImperativeHandle,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type Ref
} from "react";

export type DrawingTool = "pen" | "eraser";

export type DrawingCanvasHandle = {
  clear: () => void;
  isEmpty: () => boolean;
  getCanvas: () => HTMLCanvasElement | null;
};

// Points are stored normalized (0..1) so strokes survive canvas resizes.
type Point = { x: number; y: number };
type Stroke = { tool: DrawingTool; points: Point[] };

const PEN_WIDTH = 3;
const ERASER_WIDTH = 28;
const PEN_COLOR = "#1a1a1a";
const BG_COLOR = "#ffffff";

type DrawingCanvasProps = {
  tool: DrawingTool;
  ref?: Ref<DrawingCanvasHandle>;
};

export function DrawingCanvas({ tool, ref }: DrawingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Stroke[]>([]);
  const activeStrokeRef = useRef<Stroke | null>(null);
  const cssSizeRef = useRef({ width: 0, height: 0 });

  const toolRef = useRef(tool);
  toolRef.current = tool;

  function strokeStyle(ctx: CanvasRenderingContext2D, strokeTool: DrawingTool) {
    ctx.strokeStyle = strokeTool === "pen" ? PEN_COLOR : BG_COLOR;
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = strokeTool === "pen" ? PEN_WIDTH : ERASER_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
    const { width, height } = cssSizeRef.current;
    strokeStyle(ctx, stroke.tool);

    if (stroke.points.length === 1) {
      const p = stroke.points[0];
      ctx.beginPath();
      ctx.arc(p.x * width, p.y * height, ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    ctx.beginPath();
    stroke.points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x * width, p.y * height);
      else ctx.lineTo(p.x * width, p.y * height);
    });
    ctx.stroke();
  }

  function redraw() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const { width, height } = cssSizeRef.current;
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, width, height);

    for (const stroke of strokesRef.current) drawStroke(ctx, stroke);
    if (activeStrokeRef.current) drawStroke(ctx, activeStrokeRef.current);
  }

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    function resize() {
      if (!container || !canvas) return;
      const width = container.clientWidth;
      const height = Math.round(Math.min(Math.max(width * 0.62, 260), 520));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      cssSizeRef.current = { width, height };
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      const ctx = canvas.getContext("2d");
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      redraw();
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({
    clear() {
      strokesRef.current = [];
      activeStrokeRef.current = null;
      redraw();
    },
    isEmpty() {
      return !strokesRef.current.some(s => s.tool === "pen");
    },
    getCanvas() {
      return canvasRef.current;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }));

  function pointFromEvent(e: ReactPointerEvent<HTMLCanvasElement>): Point {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    };
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.currentTarget.setPointerCapture(e.pointerId);

    const stroke: Stroke = {
      tool: toolRef.current,
      points: [pointFromEvent(e)]
    };
    activeStrokeRef.current = stroke;

    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) drawStroke(ctx, stroke);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLCanvasElement>) {
    const stroke = activeStrokeRef.current;
    if (!stroke) return;

    const prev = stroke.points[stroke.points.length - 1];
    const next = pointFromEvent(e);
    stroke.points.push(next);

    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const { width, height } = cssSizeRef.current;
    strokeStyle(ctx, stroke.tool);
    ctx.beginPath();
    ctx.moveTo(prev.x * width, prev.y * height);
    ctx.lineTo(next.x * width, next.y * height);
    ctx.stroke();
  }

  function handlePointerEnd(e: ReactPointerEvent<HTMLCanvasElement>) {
    const stroke = activeStrokeRef.current;
    if (!stroke) return;
    activeStrokeRef.current = null;
    strokesRef.current.push(stroke);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  return (
    <div ref={containerRef} className="drawing-canvas-container">
      <canvas
        ref={canvasRef}
        className="drawing-canvas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
      />
    </div>
  );
}
