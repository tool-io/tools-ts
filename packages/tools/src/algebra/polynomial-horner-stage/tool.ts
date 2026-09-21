import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  accumulator: number;
  x: number;
  coefficient: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "accumulator", label: "Accumulator", kind: "number" },
  { id: "x", label: "X", kind: "number" },
  { id: "coefficient", label: "Coefficient", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({ nextAccumulator: i.accumulator * i.x + i.coefficient });
};
export const example = {
  input: { accumulator: 2, x: 3, coefficient: 4 },
  output: { result: { nextAccumulator: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "algebra/polynomial-horner-stage",
  title: "Algebra: Polynomial Horner Stage Tool",
  description:
    "Evaluate exactly one Horner recurrence stage with explicit prior accumulator; not another full polynomial evaluator.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { nextAccumulator: { type: "number" } },
        required: ["nextAccumulator"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
