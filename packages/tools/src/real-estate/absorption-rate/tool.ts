import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AbsorptionRateInput = Readonly<{
  readonly closedSales: number;
  readonly monthsObserved: number;
}>;
export type AbsorptionRateOutput = Readonly<{
  readonly salesPerMonth: number;
}>;

export const calculateAbsorptionRate = (
  x: AbsorptionRateInput,
): AbsorptionRateOutput => {
  if (!Number.isFinite(x.closedSales) || x.closedSales < 0)
    simpleError("closedSales", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.monthsObserved) || x.monthsObserved <= 0)
    simpleError("monthsObserved", "Provide a finite positive number.");
  if (!Number.isInteger(x.closedSales))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const salesPerMonth = x.closedSales / x.monthsObserved;
  if (!Number.isFinite(salesPerMonth))
    simpleError(
      "salesPerMonth",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { salesPerMonth: Object.is(salesPerMonth, -0) ? 0 : salesPerMonth };
};

export const example = {
  input: {
    closedSales: 30,
    monthsObserved: 3,
  },
  output: { salesPerMonth: 10 },
} satisfies ToolExample<AbsorptionRateInput, AbsorptionRateOutput>;

export const tool = createSimpleTool({
  id: "real-estate/absorption-rate",
  title: "Absorption Rate",
  description:
    "Average closed sales per month over a specified observation interval.",
  inputs: [
    { id: "closedSales", kind: "number", label: "Closed Sales", minimum: 0 },
    {
      id: "monthsObserved",
      kind: "number",
      label: "Months Observed",
      unit: "month",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "salesPerMonth",
      kind: "number",
      label: "Sales Per Month",
      unit: "1/month",
    },
  ],
  calculate: (input) =>
    calculateAbsorptionRate({
      closedSales: input.closedSales as number,
      monthsObserved: input.monthsObserved as number,
    }),
});
export const absorptionRateTool = tool;
export const runAbsorptionRate = tool.execute;
export default tool;
