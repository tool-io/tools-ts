import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReturnOnEquityInput = {
  readonly netIncome: number;
  readonly shareholdersEquity: number;
};

export type ReturnOnEquityOutput = {
  readonly roe: number;
};

export const returnOnEquityExample = {
  input: { netIncome: 50000, shareholdersEquity: 250000 },
  output: { roe: 0.2 },
} satisfies ToolExample<ReturnOnEquityInput, ReturnOnEquityOutput>;

export const calculateReturnOnEquity = (
  input: ReturnOnEquityInput,
): ReturnOnEquityOutput => {
  const { netIncome, shareholdersEquity } = input;
  if (shareholdersEquity === 0)
    simpleError(
      "shareholdersEquity",
      "Shareholders' equity must not be zero.",
      "division_not_allowed",
    );
  return { roe: netIncome / shareholdersEquity };
};

export const returnOnEquityTool = createSimpleTool({
  calculate: (input) =>
    calculateReturnOnEquity(input as unknown as ReturnOnEquityInput),
  description:
    "Calculate return on equity as net income divided by shareholders' equity.",
  id: "finance/return-on-equity",
  inputs: [
    {
      description: "Net income for the period.",
      id: "netIncome",
      kind: "number",
      label: "Net income",
      unit: "currency",
    },
    {
      description: "Total shareholders' equity.",
      id: "shareholdersEquity",
      kind: "number",
      label: "Shareholders' equity",
      unit: "currency",
    },
  ],
  outputs: [
    {
      description: "Net income per unit of shareholders' equity.",
      format: "ratio",
      id: "roe",
      kind: "number",
      label: "Return on equity",
    },
  ],
  title: "Return on Equity Calculator",
});
export const runReturnOnEquity = returnOnEquityTool.execute;
export default returnOnEquityTool;
