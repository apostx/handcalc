import { useMemo } from "react";
import katex from "katex";

type LatexProps = {
  tex: string;
  block?: boolean;
};

export function Latex({ tex, block = false }: LatexProps) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        throwOnError: false,
        displayMode: block
      }),
    [tex, block]
  );

  return (
    <span
      className={block ? "latex-block" : "latex-inline"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
