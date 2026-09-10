import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, money } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly verifiedNetUnemploymentIncomeMinor: number;
  readonly verifiedMatchedNetEmploymentIncomeMinor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "verifiedNetUnemploymentIncomeMinor",
    label: "Verified net unemployment income minor",
    kind: "number",
  },
  {
    id: "verifiedMatchedNetEmploymentIncomeMinor",
    label: "Verified matched net employment income minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.verifiedNetUnemploymentIncomeMinor, "benefitincome");
  money(input.verifiedMatchedNetEmploymentIncomeMinor, "workincome");
  positive(input.verifiedMatchedNetEmploymentIncomeMinor, "workincome");
  return {
    conditionalNetReplacementPercent:
      (100 * input.verifiedNetUnemploymentIncomeMinor) /
      input.verifiedMatchedNetEmploymentIncomeMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    verifiedNetUnemploymentIncomeMinor: 600,
    verifiedMatchedNetEmploymentIncomeMinor: 1000,
  },
  output: { result: { conditionalNetReplacementPercent: 60 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "sociology/unemployment-replacement-rate-tax-benefit",
  title: "Unemployment Replacement Rate Tax-Benefit Calculator",
  description:
    "Actual net tax-benefit replacement ratio in matched household scenario and currency. Legal entitlement, tax rules, timing and family composition independently verified; no universal welfare rate.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
