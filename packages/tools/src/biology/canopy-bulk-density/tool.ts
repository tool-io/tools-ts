import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CanopyBulkDensityInput = {
  readonly canopyFuelMassKg: number;
  readonly canopyVolumeM3: number;
};

export type CanopyBulkDensityOutput = {
  readonly canopyBulkDensityKgM3: number;
};

export const canopyBulkDensityExample = {
  input: { canopyFuelMassKg: 120, canopyVolumeM3: 400 },
  output: { canopyBulkDensityKgM3: 0.3 },
} satisfies ToolExample<CanopyBulkDensityInput, CanopyBulkDensityOutput>;

export const canopyBulkDensityTool = createSimpleTool({
  id: "biology/canopy-bulk-density",
  title: "Canopy Bulk Density",
  description:
    "Compute canopy bulk density in kilograms per cubic metre as the canopy fuel mass divided by the canopy volume.",
  inputs: [
    {
      id: "canopyFuelMassKg",
      kind: "number",
      label: "Canopy fuel mass",
      minimum: 0,
      unit: "kg",
    },
    {
      id: "canopyVolumeM3",
      kind: "number",
      label: "Canopy volume",
      unit: "m³",
    },
  ],
  outputs: [
    {
      id: "canopyBulkDensityKgM3",
      kind: "number",
      label: "Canopy bulk density",
      unit: "kg/m³",
    },
  ],
  calculate: (input) => {
    const canopyFuelMassKg = input.canopyFuelMassKg as number;
    const canopyVolumeM3 = input.canopyVolumeM3 as number;
    if (!(canopyVolumeM3 > 0))
      simpleError(
        "canopyVolumeM3",
        "The canopy volume must be greater than zero.",
      );
    return { canopyBulkDensityKgM3: canopyFuelMassKg / canopyVolumeM3 };
  },
});
export const runCanopyBulkDensity = canopyBulkDensityTool.execute;
export default canopyBulkDensityTool;
