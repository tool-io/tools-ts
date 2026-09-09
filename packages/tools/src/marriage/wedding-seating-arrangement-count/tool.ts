import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, factorialText } from "../batch48-shared.js";
export type Input = Readonly<{ readonly actualDistinctGuestCount: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualDistinctGuestCount",
    label: "Actual distinct guest count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return {
    conditionalLabeledSeatArrangementCountDecimal: factorialText(
      input.actualDistinctGuestCount,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualDistinctGuestCount: 4 },
  output: { result: { conditionalLabeledSeatArrangementCountDecimal: "24" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "marriage/wedding-seating-arrangement-count",
  title: "Wedding Seating Arrangement Count Calculator",
  description:
    "Exact n!arrangements of distinct guests in distinct labeled seats, no constraints, symmetry quotient or table equivalence. Decimal string avoids unsafe-integer rounding; not an actual seating optimizer.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
