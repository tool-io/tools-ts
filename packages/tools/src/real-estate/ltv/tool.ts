import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LtvInput = Readonly<{
  readonly loanAmount: number;
  readonly appraisedValue: number;
}>;
export type LtvOutput = Readonly<{
  readonly ltvPercent: number;
}>;

export const calculateLtv = (x: LtvInput): LtvOutput => {
  if (!Number.isFinite(x.loanAmount) || x.loanAmount < 0)
    simpleError("loanAmount", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.appraisedValue) || x.appraisedValue <= 0)
    simpleError("appraisedValue", "Provide a finite positive number.");
  const ltvPercent = (100 * x.loanAmount) / x.appraisedValue;
  if (!Number.isFinite(ltvPercent))
    simpleError(
      "ltvPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { ltvPercent: Object.is(ltvPercent, -0) ? 0 : ltvPercent };
};

export const example = {
  input: {
    loanAmount: 80000,
    appraisedValue: 100000,
  },
  output: { ltvPercent: 80 },
} satisfies ToolExample<LtvInput, LtvOutput>;

export const tool = createSimpleTool({
  id: "real-estate/ltv",
  title: "Ltv",
  description:
    "Loan-to-value percentage: loan principal divided by appraised property value; this is a ratio, not a lending decision.",
  inputs: [
    {
      id: "loanAmount",
      kind: "number",
      label: "Loan Amount",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "appraisedValue",
      kind: "number",
      label: "Appraised Value",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "ltvPercent", kind: "number", label: "Ltv Percent", unit: "percent" },
  ],
  calculate: (input) =>
    calculateLtv({
      loanAmount: input.loanAmount as number,
      appraisedValue: input.appraisedValue as number,
    }),
});
export const ltvTool = tool;
export const runLtv = tool.execute;
export default tool;
