import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LtcInput = Readonly<{
  readonly loanAmount: number;
  readonly totalProjectCost: number;
}>;
export type LtcOutput = Readonly<{
  readonly ltcPercent: number;
}>;

export const calculateLtc = (x: LtcInput): LtcOutput => {
  if (!Number.isFinite(x.loanAmount) || x.loanAmount < 0)
    simpleError("loanAmount", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.totalProjectCost) || x.totalProjectCost <= 0)
    simpleError("totalProjectCost", "Provide a finite positive number.");
  const ltcPercent = (100 * x.loanAmount) / x.totalProjectCost;
  if (!Number.isFinite(ltcPercent))
    simpleError(
      "ltcPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { ltcPercent: Object.is(ltcPercent, -0) ? 0 : ltcPercent };
};

export const example = {
  input: {
    loanAmount: 75000,
    totalProjectCost: 100000,
  },
  output: { ltcPercent: 75 },
} satisfies ToolExample<LtcInput, LtcOutput>;

export const tool = createSimpleTool({
  id: "real-estate/ltc",
  title: "Ltc",
  description:
    "Loan-to-cost percentage: financing amount divided by total project cost.",
  inputs: [
    {
      id: "loanAmount",
      kind: "number",
      label: "Loan Amount",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "totalProjectCost",
      kind: "number",
      label: "Total Project Cost",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "ltcPercent", kind: "number", label: "Ltc Percent", unit: "percent" },
  ],
  calculate: (input) =>
    calculateLtc({
      loanAmount: input.loanAmount as number,
      totalProjectCost: input.totalProjectCost as number,
    }),
});
export const ltcTool = tool;
export const runLtc = tool.execute;
export default tool;
