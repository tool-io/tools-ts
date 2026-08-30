import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RentalYieldNetInput = Readonly<{
  readonly annualNoi: number;
  readonly purchasePrice: number;
}>;
export type RentalYieldNetOutput = Readonly<{
  readonly netYieldPercent: number;
}>;

export const calculateRentalYieldNet = (
  x: RentalYieldNetInput,
): RentalYieldNetOutput => {
  if (!Number.isFinite(x.annualNoi))
    simpleError("annualNoi", "Provide a finite number.");
  if (!Number.isFinite(x.purchasePrice) || x.purchasePrice <= 0)
    simpleError("purchasePrice", "Provide a finite positive number.");
  const netYieldPercent = (100 * x.annualNoi) / x.purchasePrice;
  if (!Number.isFinite(netYieldPercent))
    simpleError(
      "netYieldPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    netYieldPercent: Object.is(netYieldPercent, -0) ? 0 : netYieldPercent,
  };
};

export const example = {
  input: {
    annualNoi: 8000,
    purchasePrice: 200000,
  },
  output: { netYieldPercent: 4 },
} satisfies ToolExample<RentalYieldNetInput, RentalYieldNetOutput>;

export const tool = createSimpleTool({
  id: "real-estate/rental-yield-net",
  title: "Rental Yield Net",
  description:
    "Annual net operating income as a percentage of acquisition price, before financing and taxes.",
  inputs: [
    { id: "annualNoi", kind: "number", label: "Annual Noi", unit: "currency" },
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
      id: "netYieldPercent",
      kind: "number",
      label: "Net Yield Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateRentalYieldNet({
      annualNoi: input.annualNoi as number,
      purchasePrice: input.purchasePrice as number,
    }),
});
export const rentalYieldNetTool = tool;
export const runRentalYieldNet = tool.execute;
export default tool;
