import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StockingPercentageInput = Readonly<{
  readonly observedBasalAreaPerHectare: number;
  readonly targetBasalAreaPerHectare: number;
}>;
export type StockingPercentageOutput = Readonly<{
  readonly stockingPercent: number;
}>;

export const calculateStockingPercentage = (
  x: StockingPercentageInput,
): StockingPercentageOutput => {
  if (
    !Number.isFinite(x.observedBasalAreaPerHectare) ||
    x.observedBasalAreaPerHectare < 0
  )
    simpleError(
      "observedBasalAreaPerHectare",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.targetBasalAreaPerHectare) ||
    x.targetBasalAreaPerHectare <= 0
  )
    simpleError(
      "targetBasalAreaPerHectare",
      "Provide a finite positive number.",
    );
  const stockingPercent =
    (100 * x.observedBasalAreaPerHectare) / x.targetBasalAreaPerHectare;
  if (!Number.isFinite(stockingPercent))
    simpleError(
      "stockingPercent",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    stockingPercent: Object.is(stockingPercent, -0) ? 0 : stockingPercent,
  };
};

export const example = {
  input: {
    observedBasalAreaPerHectare: 20,
    targetBasalAreaPerHectare: 25,
  },
  output: { stockingPercent: 80 },
} satisfies ToolExample<StockingPercentageInput, StockingPercentageOutput>;

export const tool = createSimpleTool({
  id: "forestry/stocking-percentage",
  title: "Stocking Percentage",
  description:
    "Measured stand basal area as a percentage of a user-supplied target basal area.",
  inputs: [
    {
      id: "observedBasalAreaPerHectare",
      kind: "number",
      label: "Observed Basal Area Per Hectare",
      unit: "m2/ha",
      minimum: 0,
    },
    {
      id: "targetBasalAreaPerHectare",
      kind: "number",
      label: "Target Basal Area Per Hectare",
      unit: "m2/ha",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "stockingPercent",
      kind: "number",
      label: "Stocking Percent",
      unit: "percent",
    },
  ],
  calculate: (input) =>
    calculateStockingPercentage({
      observedBasalAreaPerHectare: input.observedBasalAreaPerHectare as number,
      targetBasalAreaPerHectare: input.targetBasalAreaPerHectare as number,
    }),
});
export const stockingPercentageTool = tool;
export const runStockingPercentage = tool.execute;
export default tool;
