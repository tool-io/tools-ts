import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CanopyBulkDensityForestryInput = Readonly<{
  readonly availableFuelKilograms: number;
  readonly canopyCubicMeters: number;
}>;
export type CanopyBulkDensityForestryOutput = Readonly<{
  readonly densityKgPerCubicMeter: number;
}>;

export const calculateCanopyBulkDensityForestry = (
  x: CanopyBulkDensityForestryInput,
): CanopyBulkDensityForestryOutput => {
  if (
    !Number.isFinite(x.availableFuelKilograms) ||
    x.availableFuelKilograms < 0
  )
    simpleError(
      "availableFuelKilograms",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.canopyCubicMeters) || x.canopyCubicMeters <= 0)
    simpleError("canopyCubicMeters", "Provide a finite positive number.");
  const densityKgPerCubicMeter = x.availableFuelKilograms / x.canopyCubicMeters;
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
    availableFuelKilograms: 100,
    canopyCubicMeters: 1000,
  },
  output: { densityKgPerCubicMeter: 0.1 },
} satisfies ToolExample<
  CanopyBulkDensityForestryInput,
  CanopyBulkDensityForestryOutput
>;

export const tool = createSimpleTool({
  id: "forestry/canopy-bulk-density-forestry",
  title: "Canopy Bulk Density Forestry",
  description:
    "Canopy bulk density in kg/m³ from dry available canopy fuel mass and occupied canopy volume.",
  inputs: [
    {
      id: "availableFuelKilograms",
      kind: "number",
      label: "Available Fuel Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "canopyCubicMeters",
      kind: "number",
      label: "Canopy Cubic Meters",
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
    calculateCanopyBulkDensityForestry({
      availableFuelKilograms: input.availableFuelKilograms as number,
      canopyCubicMeters: input.canopyCubicMeters as number,
    }),
});
export const canopyBulkDensityForestryTool = tool;
export const runCanopyBulkDensityForestry = tool.execute;
export default tool;
