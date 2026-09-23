import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  x: number;
  functionValue: number;
  partialDerivative: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "x", label: "X", kind: "number" },
  { id: "functionValue", label: "Function value", kind: "number" },
  { id: "partialDerivative", label: "Partial derivative", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.functionValue !== 0);
  return H.finish({
    elasticity: (i.x * i.partialDerivative) / i.functionValue,
  });
};
export const example = {
  input: { x: 2, functionValue: 4, partialDerivative: 3 },
  output: { result: { elasticity: 1.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "calculus/partial-elasticity-at-supplied-point",
  title: "Calculus: Partial Elasticity At Supplied Point Tool",
  description:
    "Compute one dimensionless partial elasticity (x/f)*df/dx at an explicitly supplied point, rejecting zero function value; no model fitting.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { elasticity: { type: "number" } },
        required: ["elasticity"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
