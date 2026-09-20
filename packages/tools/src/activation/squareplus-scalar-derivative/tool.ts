import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ x: number; smoothing: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", label: "X", kind: "number" },
  { id: "smoothing", label: "Smoothing", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.smoothing);
  return H.finish({
    derivative: (1 + i.x / Math.hypot(i.x, Math.sqrt(i.smoothing))) / 2,
  });
};
export const example = {
  input: { x: 0, smoothing: 4 },
  output: { result: { derivative: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/squareplus-scalar-derivative",
  title: "Activation: Squareplus Scalar Derivative Tool",
  description:
    "Evaluate one squareplus derivative with explicit positive smoothing and a stable hypotenuse norm.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { derivative: { type: "number" } },
        required: ["derivative"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
