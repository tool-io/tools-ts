import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RentalYieldGrossInput = Readonly<{
  readonly annualGrossRent: number;
  readonly purchasePrice: number;
}>;
export type RentalYieldGrossOutput = Readonly<{
  readonly grossYieldPercent: number;
}>;

export const calculateRentalYieldGross = (
  x: RentalYieldGrossInput,
): RentalYieldGrossOutput => {
  if (!Number.isFinite(x.annualGrossRent) || x.annualGrossRent < 0)
    simpleError("annualGrossRent", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.purchasePrice) || x.purchasePrice <= 0)
    simpleError("purchasePrice", "Provide a finite positive number.");
  const grossYieldPercent = (100 * x.annualGrossRent) / x.purchasePrice;
  if (!Number.isFinite(grossYieldPercent))
    simpleError(
      "grossYieldPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    grossYieldPercent: Object.is(grossYieldPercent, -0) ? 0 : grossYieldPercent,
  };
};

export const example = {
  input: {
    annualGrossRent: 12000,
    purchasePrice: 200000,
  },
  output: { grossYieldPercent: 6 },
} satisfies ToolExample<RentalYieldGrossInput, RentalYieldGrossOutput>;

export const tool = createSimpleTool({
  id: "real-estate/rental-yield-gross",
  title: "Rental Yield Gross",
  description:
    "Annual gross rent as a percentage of acquisition price, before vacancy and expenses.",
  inputs: [
    {
      id: "annualGrossRent",
      kind: "number",
      label: "Annual Gross Rent",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "purchasePrice",
      kind: "number",
      label: "Purchase Price",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "grossYieldPercent",
      kind: "number",
      label: "Gross Yield Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateRentalYieldGross({
      annualGrossRent: input.annualGrossRent as number,
      purchasePrice: input.purchasePrice as number,
    }),
});
export const rentalYieldGrossTool = tool;
export const runRentalYieldGross = tool.execute;
export default tool;
