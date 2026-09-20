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
  return H.finish({ derivative: 1 / (1 + Math.abs(i.x)) ** 2 });
};
export const example = {
  input: { x: 1 },
  output: { result: { derivative: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "activation/softsign-scalar-derivative",
  title: "Activation: Softsign Scalar Derivative Tool",
  description:
    "Evaluate the scalar softsign derivative including its continuous derivative at zero.",
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
