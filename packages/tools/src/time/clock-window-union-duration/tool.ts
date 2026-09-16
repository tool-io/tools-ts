import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ windowsJson: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "windowsJson", kind: "string", label: "windowsJson" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const segments = H.merge(H.clockSpans(i.windowsJson));
  return H.finish({
    segments,
    duration: segments.reduce((s, [a, b]) => s + b - a, 0),
  });
};
export const example = {
  input: { windowsJson: "[[80000,100],[50,200]]" },
  output: {
    result: {
      segments: [
        [0, 200],
        [80000, 86400],
      ],
      duration: 6600,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "time/clock-window-union-duration",
  title: "Clock Window Union Duration",
  description:
    "Merge overlapping civil clock windows after overnight splitting and count covered seconds once on the fixed day.",
  inputs: fields,
  outputs: [{ id: "result", label: "Explicit result", kind: "object" }],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
