import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ x: number; beta: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", label: "X", kind: "number" },
  { id: "beta", label: "Beta", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(Math.abs(i.beta * i.x) <= 1e300);
  const s = H.sigmoid(i.beta * i.x);
  return H.finish({ derivative: s + i.beta * i.x * s * (1 - s) });
};
export const example = {
  input: { x: 0, beta: 1 },
  output: { result: { derivative: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/swish-scalar-derivative-beta",
  title: "Activation: Swish Scalar Derivative Beta Tool",
  description:
    "Evaluate the input derivative of beta-Swish x*sigmoid(beta*x) for explicit finite beta; beta is not learned or fitted.",
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
