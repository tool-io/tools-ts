import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyVerifiedAnnualDenariiRate: number;
  readonly paidYearFraction: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyVerifiedAnnualDenariiRate",
    label: "Independently verified annual denarii rate",
    kind: "number",
  },
  { id: "paidYearFraction", label: "Paid year fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.independentlyVerifiedAnnualDenariiRate,
    "independentlyVerifiedAnnualDenariiRate",
  );
  fraction(input.paidYearFraction, "paidYearFraction");
  return {
    nominalDenariiAccrual:
      input.independentlyVerifiedAnnualDenariiRate * input.paidYearFraction,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyVerifiedAnnualDenariiRate: 225, paidYearFraction: 0.5 },
  output: { result: { nominalDenariiAccrual: 112.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/soldier-stipendium-225-denarii-reference-rate",
  title: "Soldier Stipendium 225-Denarii Reference Rate",
  description:
    "Nominal stipendium reference accrual from an independently verified era/rank annual rate;225is example only. Excludes deductions, bonuses, purchasing power and modern monetary rounding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { nominalDenariiAccrual: { type: "number" } },
        required: ["nominalDenariiAccrual"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
