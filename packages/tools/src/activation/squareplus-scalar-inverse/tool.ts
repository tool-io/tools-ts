import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ y: number; smoothing: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "y", label: "Y", kind: "number" },
  { id: "smoothing", label: "Smoothing", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.y);
  H.positive(i.smoothing);
  return H.finish({ x: i.y - i.smoothing / (4 * i.y) });
};
export const example = {
  input: { y: 2, smoothing: 4 },
  output: { result: { x: 1.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/squareplus-scalar-inverse",
  title: "Activation: Squareplus Scalar Inverse Tool",
  description:
    "Invert squareplus y=(x+sqrt(x*x+b))/2 for positive supplied smoothing b and y>0.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { x: { type: "number" } },
        required: ["x"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
