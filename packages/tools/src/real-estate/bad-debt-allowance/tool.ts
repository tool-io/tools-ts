import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BadDebtAllowanceInput = Readonly<{
  readonly receivables: number;
  readonly expectedLossPercent: number;
}>;
export type BadDebtAllowanceOutput = Readonly<{
  readonly allowance: number;
}>;

export const calculateBadDebtAllowance = (
  x: BadDebtAllowanceInput,
): BadDebtAllowanceOutput => {
  if (!Number.isFinite(x.receivables) || x.receivables < 0)
    simpleError("receivables", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.expectedLossPercent) || x.expectedLossPercent < 0)
    simpleError("expectedLossPercent", "Provide a finite nonnegative number.");
  if (!(x.expectedLossPercent <= 100))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const allowance = (x.receivables * x.expectedLossPercent) / 100;
  if (!Number.isFinite(allowance))
    simpleError(
      "allowance",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { allowance: Object.is(allowance, -0) ? 0 : allowance };
};

export const example = {
  input: {
    receivables: 10000,
    expectedLossPercent: 3,
  },
  output: { allowance: 300 },
} satisfies ToolExample<BadDebtAllowanceInput, BadDebtAllowanceOutput>;

export const tool = createSimpleTool({
  id: "real-estate/bad-debt-allowance",
  title: "Bad Debt Allowance",
  description:
    "Allowance estimate from outstanding receivables and a user-selected expected uncollectible percentage.",
  inputs: [
    {
      id: "receivables",
      kind: "number",
      label: "Receivables",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "expectedLossPercent",
      kind: "number",
      label: "Expected Loss Percent",
      unit: "percent",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "allowance", kind: "number", label: "Allowance", unit: "currency" },
  ],
  calculate: (input) =>
    calculateBadDebtAllowance({
      receivables: input.receivables as number,
      expectedLossPercent: input.expectedLossPercent as number,
    }),
});
export const badDebtAllowanceTool = tool;
export const runBadDebtAllowance = tool.execute;
export default tool;
