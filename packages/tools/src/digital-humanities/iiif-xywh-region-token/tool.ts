import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ token: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "token", label: "Token", kind: "string" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const m = /^(?:pct:)?(\d{1,9}),(\d{1,9}),(\d{1,9}),(\d{1,9})(?![\s\S])/.exec(
    i.token,
  );
  H.check(m && Number(m[3]) > 0 && Number(m[4]) > 0);
  if (i.token.startsWith("pct:"))
    H.check(
      Number(m![1]) + Number(m![3]) <= 100 &&
        Number(m![2]) + Number(m![4]) <= 100,
    );
  return H.finish({
    x: Number(m![1]),
    y: Number(m![2]),
    width: Number(m![3]),
    height: Number(m![4]),
    percent: i.token.startsWith("pct:"),
  });
};
export const example = {
  input: { token: "pct:10,20,30,40" },
  output: { result: { x: 10, y: 20, width: 30, height: 40, percent: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "digital-humanities/iiif-xywh-region-token",
  title: "Digital Humanities: IIIF Xywh Region Token Tool",
  description:
    "Parse a restricted IIIF xywh region into pixel or percentage fields, rejecting zero extents and percentage boxes beyond 100; no image retrieval or full Image API parser.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          height: { type: "number" },
          percent: { type: "boolean" },
          width: { type: "number" },
          x: { type: "number" },
          y: { type: "number" },
        },
        required: ["height", "percent", "width", "x", "y"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
