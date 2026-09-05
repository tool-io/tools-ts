import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch45-shared.js";
export type Input = Readonly<{
  readonly verifiedLossRatioPercent: number;
  readonly verifiedExpenseRatioPercent: number;
  readonly verifiedInvestmentIncomeRatioPercent: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "verifiedLossRatioPercent",
    label: "Verified loss ratio percent",
    kind: "number",
  },
  {
    id: "verifiedExpenseRatioPercent",
    label: "Verified expense ratio percent",
    kind: "number",
  },
  {
    id: "verifiedInvestmentIncomeRatioPercent",
    label: "Verified investment income ratio percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.verifiedLossRatioPercent, "lossratio");
  nonnegative(input.verifiedExpenseRatioPercent, "expenseratio");
  return {
    conditionalCombinedOperatingRatioPercent:
      input.verifiedLossRatioPercent +
      input.verifiedExpenseRatioPercent -
      input.verifiedInvestmentIncomeRatioPercent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    verifiedLossRatioPercent: 65,
    verifiedExpenseRatioPercent: 25,
    verifiedInvestmentIncomeRatioPercent: 5,
  },
  output: { result: { conditionalCombinedOperatingRatioPercent: 85 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/combined-operating-ratio-insurer",
  title: "Combined Operating Ratio Insurer Calculator",
  description:
    "Conditional operating ratio=caller matched loss+expense\u2212investment-income ratios in percentage points. Caller independently harmonizes actual denominators and accounting conventions; not infer profit, solvency or universal mixed earned/written premium ratios.",
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
