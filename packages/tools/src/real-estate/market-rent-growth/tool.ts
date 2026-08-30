import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MarketRentGrowthInput = Readonly<{
  readonly oldMarketRent: number;
  readonly newMarketRent: number;
}>;
export type MarketRentGrowthOutput = Readonly<{
  readonly growthPercent: number;
}>;

export const calculateMarketRentGrowth = (
  x: MarketRentGrowthInput,
): MarketRentGrowthOutput => {
  if (!Number.isFinite(x.oldMarketRent) || x.oldMarketRent <= 0)
    simpleError("oldMarketRent", "Provide a finite positive number.");
  if (!Number.isFinite(x.newMarketRent) || x.newMarketRent < 0)
    simpleError("newMarketRent", "Provide a finite nonnegative number.");
  const growthPercent = 100 * (x.newMarketRent / x.oldMarketRent - 1);
  if (!Number.isFinite(growthPercent))
    simpleError(
      "growthPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { growthPercent: Object.is(growthPercent, -0) ? 0 : growthPercent };
};

export const example = {
  input: {
    oldMarketRent: 1000,
    newMarketRent: 1100,
  },
  output: { growthPercent: 10.000000000000009 },
} satisfies ToolExample<MarketRentGrowthInput, MarketRentGrowthOutput>;

export const tool = createSimpleTool({
  id: "real-estate/market-rent-growth",
  title: "Market Rent Growth",
  description:
    "Percentage change from an old market rent to a new market rent over a stated period.",
  inputs: [
    {
      id: "oldMarketRent",
      kind: "number",
      label: "Old Market Rent",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "newMarketRent",
      kind: "number",
      label: "New Market Rent",
      unit: "currency",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "growthPercent",
      kind: "number",
      label: "Growth Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateMarketRentGrowth({
      oldMarketRent: input.oldMarketRent as number,
      newMarketRent: input.newMarketRent as number,
    }),
});
export const marketRentGrowthTool = tool;
export const runMarketRentGrowth = tool.execute;
export default tool;
