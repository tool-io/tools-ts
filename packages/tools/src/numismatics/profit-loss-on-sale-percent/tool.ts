import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProfitLossOnSalePercentInput = Readonly<{
  readonly saleProceeds: number;
  readonly totalCost: number;
}>;
export type ProfitLossOnSalePercentOutput = Readonly<{
  readonly returnPercent: number;
}>;

export const calculateProfitLossOnSalePercent = (
  x: ProfitLossOnSalePercentInput,
): ProfitLossOnSalePercentOutput => {
  if (!Number.isFinite(x.saleProceeds) || x.saleProceeds < 0)
    simpleError("saleProceeds", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.totalCost) || x.totalCost <= 0)
    simpleError("totalCost", "Provide a finite positive number.");
  const returnPercent = ((x.saleProceeds - x.totalCost) / x.totalCost) * 100;
  if (!Number.isFinite(returnPercent))
    simpleError(
      "returnPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { returnPercent: Object.is(returnPercent, -0) ? 0 : returnPercent };
};

export const example = {
  input: {
    saleProceeds: 120,
    totalCost: 100,
  },
  output: { returnPercent: 20 },
} satisfies ToolExample<
  ProfitLossOnSalePercentInput,
  ProfitLossOnSalePercentOutput
>;

export const tool = createSimpleTool({
  id: "numismatics/profit-loss-on-sale-percent",
  title: "Profit Loss On Sale Percent",
  description:
    "Calculate signed sale return after using proceeds and all entered costs; not a tax calculation.",
  inputs: [
    {
      id: "saleProceeds",
      kind: "number",
      label: "Sale Proceeds",
      unit: "currency",
    },
    { id: "totalCost", kind: "number", label: "Total Cost", unit: "currency" },
  ],
  outputs: [
    { id: "returnPercent", kind: "number", label: "Return Percent", unit: "%" },
  ],
  calculate: (input) =>
    calculateProfitLossOnSalePercent({
      saleProceeds: input.saleProceeds as number,
      totalCost: input.totalCost as number,
    }),
});
export const runProfitLossOnSalePercent = tool.execute;
export default tool;
