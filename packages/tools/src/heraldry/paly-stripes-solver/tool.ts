import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bands } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fieldWidth: number;
  readonly stripeWeights: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fieldWidth", label: "Field width", kind: "number" },
  { id: "stripeWeights", label: "Stripe weights", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return bands(input.fieldWidth, input.stripeWeights);
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { fieldWidth: 100, stripeWeights: [1, 1, 2] },
  output: { result: { boundaries: [0, 25, 50, 100], widths: [25, 25, 50] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/paly-stripes-solver",
  title: "Paly Vertical Stripes Count Solver",
  description:
    "Divide explicit fieldWidth into caller ordered stripe weights; does not infer tinctures or mandated stripe counts.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
