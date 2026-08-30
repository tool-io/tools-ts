import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StockingDensityInput = Readonly<{
  readonly biomassKilograms: number;
  readonly waterVolumeCubicMeters: number;
}>;
export type StockingDensityOutput = Readonly<{
  readonly stockingDensityKgPerM3: number;
}>;

export const calculateStockingDensity = (
  x: StockingDensityInput,
): StockingDensityOutput => {
  if (!Number.isFinite(x.biomassKilograms) || x.biomassKilograms < 0)
    simpleError("biomassKilograms", "Provide a finite nonnegative number.");
  if (
    !Number.isFinite(x.waterVolumeCubicMeters) ||
    x.waterVolumeCubicMeters <= 0
  )
    simpleError("waterVolumeCubicMeters", "Provide a finite positive number.");
  const stockingDensityKgPerM3 = x.biomassKilograms / x.waterVolumeCubicMeters;
  if (!Number.isFinite(stockingDensityKgPerM3))
    simpleError(
      "stockingDensityKgPerM3",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    stockingDensityKgPerM3: Object.is(stockingDensityKgPerM3, -0)
      ? 0
      : stockingDensityKgPerM3,
  };
};

export const example = {
  input: {
    biomassKilograms: 1000,
    waterVolumeCubicMeters: 100,
  },
  output: { stockingDensityKgPerM3: 10 },
} satisfies ToolExample<StockingDensityInput, StockingDensityOutput>;

export const tool = createSimpleTool({
  id: "aquaculture/stocking-density",
  title: "Stocking Density",
  description:
    "Calculate live biomass per cubic metre of stocked water; this does not prescribe a safe species-specific density.",
  inputs: [
    {
      id: "biomassKilograms",
      kind: "number",
      label: "Biomass Kilograms",
      unit: "kg",
    },
    {
      id: "waterVolumeCubicMeters",
      kind: "number",
      label: "Water Volume Cubic Meters",
      unit: "m³",
    },
  ],
  outputs: [
    {
      id: "stockingDensityKgPerM3",
      kind: "number",
      label: "Stocking Density Kg Per M3",
      unit: "kg/m³",
    },
  ],
  calculate: (input) =>
    calculateStockingDensity({
      biomassKilograms: input.biomassKilograms as number,
      waterVolumeCubicMeters: input.waterVolumeCubicMeters as number,
    }),
});
export const runStockingDensity = tool.execute;
export default tool;
