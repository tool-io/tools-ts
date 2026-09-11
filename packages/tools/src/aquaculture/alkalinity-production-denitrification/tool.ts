import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyQualifiedDenitrifiedNitrateMoles: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyQualifiedDenitrifiedNitrateMoles",
    label: "Actual independently qualified denitrified nitrate moles",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyQualifiedDenitrifiedNitrateMoles,
    "actualIndependentlyQualifiedDenitrifiedNitrateMoles",
  );
  return { value: input.actualIndependentlyQualifiedDenitrifiedNitrateMoles };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIndependentlyQualifiedDenitrifiedNitrateMoles: 2 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/alkalinity-production-denitrification",
  title: "Alkalinity Production Denitrification Calculator",
  description:
    "Ideal heterotrophiccomplete nitrate\u2192N2denitrification1equivalentalka per mole nitrateN, actual independently verified pathway, notsulfuroxidizingvariant/dosing prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
