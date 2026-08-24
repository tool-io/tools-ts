import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type OperatingMarginAmountInput = {
  readonly operatingIncome: number;
  readonly revenue: number;
};

export type OperatingMarginAmountOutput = {
  readonly operatingMargin: number;
};

export const operatingMarginAmountExample = {
  input: { operatingIncome: 9000, revenue: 60000 },
  output: { operatingMargin: 0.15 },
} satisfies ToolExample<
  OperatingMarginAmountInput,
  OperatingMarginAmountOutput
>;

export const calculateOperatingMarginAmount = (
  input: OperatingMarginAmountInput,
): OperatingMarginAmountOutput => {
  const { operatingIncome, revenue } = input;
  if (!Number.isFinite(operatingIncome))
    simpleError(
      "operatingIncome",
      "Operating income must be finite.",
      "invalid_operating_income",
    );
  if (!Number.isFinite(revenue) || revenue <= 0)
    simpleError(
      "revenue",
      "Revenue must be greater than zero.",
      "invalid_revenue",
    );
  const operatingMargin = operatingIncome / revenue;
  if (!Number.isFinite(operatingMargin))
    simpleError(
      "operatingIncome",
      "The operating margin exceeds the numeric range.",
      "numeric_range",
    );
  return { operatingMargin };
};

export const operatingMarginAmountTool = createSimpleTool({
  calculate: (input) =>
    calculateOperatingMarginAmount({
      operatingIncome: input.operatingIncome as number,
      revenue: input.revenue as number,
    }),
  description:
    "Calculate operating margin as operating income divided by revenue.",
  id: "finance/operating-margin-amount",
  inputs: [
    {
      description: "Profit left after operating expenses.",
      id: "operatingIncome",
      kind: "number",
      label: "Operating income",
      unit: "currency",
    },
    {
      description: "Total sales revenue for the period.",
      id: "revenue",
      kind: "number",
      label: "Revenue",
      minimum: 0,
      unit: "currency",
    },
  ],
  outputs: [
    {
      description: "Operating income per unit of revenue.",
      format: "ratio",
      id: "operatingMargin",
      kind: "number",
      label: "Operating margin",
    },
  ],
  title: "Operating Margin Amount Calculator",
});
export const runOperatingMarginAmount = operatingMarginAmountTool.execute;
export default operatingMarginAmountTool;
