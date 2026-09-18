import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../css/batch55-shared.js";
export type Input = Readonly<{ text: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "text", label: "text", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const tokens = H.escapeTokens(i.text),
    spans: { start: number; end: number; style: H.SgrStyle }[] = [];
  let p = 0,
    style = H.emptyStyle();
  for (const t of tokens) {
    H.check(
      t.complete && t.type === "CSI" && /^\[[0-9;]*m(?![\s\S])/.test(t.text),
    );
    if (t.start > p)
      spans.push({ start: p, end: t.start, style: { ...style } });
    const raw = t.text.slice(2, -1);
    style = H.replaySgr(
      raw === "" ? [0] : raw.split(";").map((x) => Number(x || 0)),
      style,
    );
    p = t.end;
  }
  if (p < i.text.length)
    spans.push({ start: p, end: i.text.length, style: { ...style } });
  return H.finish({ spans });
};
export const example = {
  input: { text: "a\u001b[31mb" },
  output: {
    result: {
      spans: [
        {
          start: 0,
          end: 1,
          style: {
            bold: false,
            faint: false,
            italic: false,
            underline: false,
            inverse: false,
            strike: false,
            foreground: "default",
            background: "default",
          },
        },
        {
          start: 6,
          end: 7,
          style: {
            bold: false,
            faint: false,
            italic: false,
            underline: false,
            inverse: false,
            strike: false,
            foreground: "index:1",
            background: "default",
          },
        },
      ],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "terminal/sgr-style-span-map",
  title: "Terminal SGR Style Span Map",
  description:
    "Map plain-text spans to replayed supported SGR style records with original UTF-16 offsets; any non-SGR escape or incomplete control rejects, no terminal execution.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit bounded result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
