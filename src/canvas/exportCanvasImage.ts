export type ExportedCanvasImage = {
  base64: string;
  mimeType: string;
  byteSize: number;
};

// Providers reject very large payloads (Groq caps base64 images at 4 MB).
export const MAX_IMAGE_BYTES = 3_500_000;
const MAX_EXPORT_WIDTH = 1280;

export function exportCanvasImage(
  canvas: HTMLCanvasElement
): ExportedCanvasImage {
  let source: HTMLCanvasElement = canvas;

  // Downscale high-DPI canvases so the payload stays small.
  if (canvas.width > MAX_EXPORT_WIDTH) {
    const scale = MAX_EXPORT_WIDTH / canvas.width;
    const scaled = document.createElement("canvas");
    scaled.width = MAX_EXPORT_WIDTH;
    scaled.height = Math.round(canvas.height * scale);
    const ctx = scaled.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, scaled.width, scaled.height);
      ctx.drawImage(canvas, 0, 0, scaled.width, scaled.height);
      source = scaled;
    }
  }

  const dataUrl = source.toDataURL("image/png");
  const base64 = dataUrl.split(",")[1] ?? "";
  return {
    base64,
    mimeType: "image/png",
    byteSize: Math.ceil((base64.length * 3) / 4)
  };
}
