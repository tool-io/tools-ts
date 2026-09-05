import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, money } from "../batch45-shared.js";
export type Input = Readonly<{
  readonly verifiedUnderwritingExpenseMinor: number;
  readonly callerApplicablePremiumDenominatorMinor: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "verifiedUnderwritingExpenseMinor",
    label: "Verified underwriting expense minor",
    kind: "number",
  },
  {
    id: "callerApplicablePremiumDenominatorMinor",
    label: "Caller applicable premium denominator minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.verifiedUnderwritingExpenseMinor, "expense");
  money(input.callerApplicablePremiumDenominatorMinor, "denominator");
  positive(input.callerApplicablePremiumDenominatorMinor, "denominator");
  return {
    observedExpenseRatioPercent:
      (100 * input.verifiedUnderwritingExpenseMinor) /
      input.callerApplicablePremiumDenominatorMinor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    verifiedUnderwritingExpenseMinor: 25000,
    callerApplicablePremiumDenominatorMinor: 100000,
  },
  output: { result: { observedExpenseRatioPercent: 25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/expense-ratio-underwriting-percent",
  title: "Expense Ratio Underwriting Percent Calculator",
  description:
    "Actual underwriting expense ratio against explicitly selected independently applicable premium denominator. One currency, same reporting period; earned/written conventions are not silently mixed and no profitability claim follows.",
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
