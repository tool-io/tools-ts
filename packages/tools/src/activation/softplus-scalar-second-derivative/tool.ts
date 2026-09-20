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
  H.positive(i.beta);
  H.check(Number.isFinite(i.beta * i.x));
  const s = H.sigmoid(i.beta * i.x);
  return H.finish({ secondDerivative: i.beta * s * (1 - s) });
};
export const example = {
  input: { x: 0, beta: 2 },
  output: { result: { secondDerivative: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/softplus-scalar-second-derivative",
  title: "Activation: Softplus Scalar Second Derivative Tool",
  description:
    "Evaluate the second input derivative of beta-scaled softplus log(1+exp(beta*x))/beta for explicit positive beta.",
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
