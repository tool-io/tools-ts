import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ x: number; threshold: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", label: "X", kind: "number" },
  { id: "threshold", label: "Threshold", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.threshold, 0, 1e12);
  return H.finish({
    retained: Math.abs(i.x) > i.threshold,
    output: Math.sign(i.x) * Math.max(0, Math.abs(i.x) - i.threshold),
  });
};
export const example = {
  input: { x: -3, threshold: 2 },
  output: { result: { retained: true, output: -1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/softshrink-threshold-decision",
  title: "Activation: Softshrink Threshold Decision Tool",
  description:
    "Apply scalar softshrink with explicit nonnegative threshold and zero at either threshold endpoint.",
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
          output: { type: "number" },
          retained: { type: "boolean" },
        },
        required: ["output", "retained"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
