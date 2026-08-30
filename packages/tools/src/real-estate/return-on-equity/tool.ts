import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReturnOnEquityInput = Readonly<{
  readonly annualCashFlow: number;
  readonly investedEquity: number;
}>;
export type ReturnOnEquityOutput = Readonly<{
  readonly returnPercent: number;
}>;

export const calculateReturnOnEquity = (
  x: ReturnOnEquityInput,
): ReturnOnEquityOutput => {
  if (!Number.isFinite(x.annualCashFlow))
    simpleError("annualCashFlow", "Provide a finite number.");
  if (!Number.isFinite(x.investedEquity) || x.investedEquity <= 0)
    simpleError("investedEquity", "Provide a finite positive number.");
  const returnPercent = (100 * x.annualCashFlow) / x.investedEquity;
  if (!Number.isFinite(returnPercent))
    simpleError(
      "returnPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { returnPercent: Object.is(returnPercent, -0) ? 0 : returnPercent };
};

export const example = {
  input: {
    annualCashFlow: 10000,
    investedEquity: 100000,
  },
  output: { returnPercent: 10 },
} satisfies ToolExample<ReturnOnEquityInput, ReturnOnEquityOutput>;

export const tool = createSimpleTool({
  id: "real-estate/return-on-equity",
  title: "Return On Equity",
  description:
    "Annual after-debt cash flow as a percentage of invested equity; not an IRR.",
  inputs: [
    {
      id: "annualCashFlow",
      kind: "number",
      label: "Annual Cash Flow",
      unit: "currency",
    },
    {
      id: "investedEquity",
      kind: "number",
      label: "Invested Equity",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "returnPercent",
      kind: "number",
      label: "Return Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateReturnOnEquity({
      annualCashFlow: input.annualCashFlow as number,
      investedEquity: input.investedEquity as number,
    }),
});
export const returnOnEquityTool = tool;
export const runReturnOnEquity = tool.execute;
export default tool;
