import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EquityMultipleInput = Readonly<{
  readonly totalDistributions: number;
  readonly investedEquity: number;
}>;
export type EquityMultipleOutput = Readonly<{
  readonly equityMultiple: number;
}>;

export const calculateEquityMultiple = (
  x: EquityMultipleInput,
): EquityMultipleOutput => {
  if (!Number.isFinite(x.totalDistributions) || x.totalDistributions < 0)
    simpleError("totalDistributions", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.investedEquity) || x.investedEquity <= 0)
    simpleError("investedEquity", "Provide a finite positive number.");
  const equityMultiple = x.totalDistributions / x.investedEquity;
  if (!Number.isFinite(equityMultiple))
    simpleError(
      "equityMultiple",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { equityMultiple: Object.is(equityMultiple, -0) ? 0 : equityMultiple };
};

export const example = {
  input: {
    totalDistributions: 150000,
    investedEquity: 100000,
  },
  output: { equityMultiple: 1.5 },
} satisfies ToolExample<EquityMultipleInput, EquityMultipleOutput>;

export const tool = createSimpleTool({
  id: "real-estate/equity-multiple",
  title: "Equity Multiple",
  description:
    "Equity multiple: total distributions received divided by invested equity, without annualization.",
  inputs: [
    {
      id: "totalDistributions",
      kind: "number",
      label: "Total Distributions",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "investedEquity",
      kind: "number",
      label: "Invested Equity",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [{ id: "equityMultiple", kind: "number", label: "Equity Multiple" }],
  calculate: (input) =>
    calculateEquityMultiple({
      totalDistributions: input.totalDistributions as number,
      investedEquity: input.investedEquity as number,
    }),
});
export const equityMultipleTool = tool;
export const runEquityMultiple = tool.execute;
export default tool;
