import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrownBulkDensityInput = Readonly<{
  readonly crownFuelKilograms: number;
  readonly crownCubicMeters: number;
}>;
export type CrownBulkDensityOutput = Readonly<{
  readonly densityKgPerCubicMeter: number;
}>;

export const calculateCrownBulkDensity = (
  x: CrownBulkDensityInput,
): CrownBulkDensityOutput => {
  if (!Number.isFinite(x.crownFuelKilograms) || x.crownFuelKilograms < 0)
    simpleError("crownFuelKilograms", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.crownCubicMeters) || x.crownCubicMeters <= 0)
    simpleError("crownCubicMeters", "Provide a finite positive number.");
  const densityKgPerCubicMeter = x.crownFuelKilograms / x.crownCubicMeters;
  if (!Number.isFinite(densityKgPerCubicMeter))
    simpleError(
      "densityKgPerCubicMeter",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    densityKgPerCubicMeter: Object.is(densityKgPerCubicMeter, -0)
      ? 0
      : densityKgPerCubicMeter,
  };
};

export const example = {
  input: {
    crownFuelKilograms: 10,
    crownCubicMeters: 100,
  },
  output: { densityKgPerCubicMeter: 0.1 },
} satisfies ToolExample<CrownBulkDensityInput, CrownBulkDensityOutput>;

export const tool = createSimpleTool({
  id: "forestry/crown-bulk-density",
  title: "Crown Bulk Density",
  description:
    "Individual crown fuel density in kg/m³ from dry crown mass and measured crown volume.",
  inputs: [
    {
      id: "crownFuelKilograms",
      kind: "number",
      label: "Crown Fuel Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "crownCubicMeters",
      kind: "number",
      label: "Crown Cubic Meters",
      unit: "m3",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "densityKgPerCubicMeter",
      kind: "number",
      label: "Density Kg Per Cubic Meter",
      unit: "kg/m3",
    },
  ],
  calculate: (input) =>
    calculateCrownBulkDensity({
      crownFuelKilograms: input.crownFuelKilograms as number,
      crownCubicMeters: input.crownCubicMeters as number,
    }),
});
export const crownBulkDensityTool = tool;
export const runCrownBulkDensity = tool.execute;
export default tool;
