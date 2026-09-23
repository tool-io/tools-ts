import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  x: number;
  anchorX: number;
  anchorY: number;
  derivative: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", label: "X", kind: "number" },
  { id: "anchorX", label: "Anchor x", kind: "number" },
  { id: "anchorY", label: "Anchor y", kind: "number" },
  { id: "derivative", label: "Derivative", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    linearizedY: i.anchorY + i.derivative * (i.x - i.anchorX),
  });
};
export const example = {
  input: { x: 3, anchorX: 1, anchorY: 4, derivative: 2 },
  output: { result: { linearizedY: 8 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "calculus/tangent-line-from-point-derivative",
  title: "Calculus: Tangent Line From Point Derivative Tool",
  description:
    "Evaluate the point-derivative tangent-line linearization at one x; the derivative is caller established, not symbolically inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { linearizedY: { type: "number" } },
        required: ["linearizedY"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
