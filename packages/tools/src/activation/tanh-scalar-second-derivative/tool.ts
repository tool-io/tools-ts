import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ x: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", label: "X", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const t = Math.tanh(i.x);
  return H.finish({ secondDerivative: -2 * t * (1 - t * t) });
};
export const example = {
  input: { x: 0 },
  output: { result: { secondDerivative: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/tanh-scalar-second-derivative",
  title: "Activation: Tanh Scalar Second Derivative Tool",
  description:
    "Evaluate the analytic second scalar derivative of tanh using its bounded forward value.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { secondDerivative: { type: "number" } },
        required: ["secondDerivative"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
