import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DryDensityInput = {
  readonly bulkDensityKgPerM3: number;
  readonly waterContentFraction: number;
};

export type DryDensityOutput = {
  readonly dryDensityKgPerM3: number;
};

export const calculateDryDensity = (
  input: DryDensityInput,
): DryDensityOutput => {
  if (!(input.bulkDensityKgPerM3 > 0))
    simpleError(
      "bulkDensityKgPerM3",
      "Bulk density must be greater than zero.",
      "invalid_density",
    );
  if (!(input.waterContentFraction >= 0))
    simpleError(
      "waterContentFraction",
      "Water content cannot be negative.",
      "invalid_water_content",
    );
  return {
    dryDensityKgPerM3:
      input.bulkDensityKgPerM3 / (1 + input.waterContentFraction),
  };
};

export const dryDensityExample = {
  input: { bulkDensityKgPerM3: 2100, waterContentFraction: 0.15 },
  output: { dryDensityKgPerM3: 1826.0869565217392 },
} satisfies ToolExample<DryDensityInput, DryDensityOutput>;

export const dryDensityTool = createSimpleTool({
  id: "geology/dry-density",
  title: "Dry Density Calculator",
  description:
    "Compute dry density from wet (bulk) density and gravimetric water content using rho_d = rho / (1 + w).",
  inputs: [
    {
      description: "Wet (bulk) density in kg/m3.",
      id: "bulkDensityKgPerM3",
      kind: "number",
      label: "Bulk density",
      minimum: 0,
    },
    {
      description:
        "Gravimetric water content as a decimal fraction of the dry mass (e.g. 0.15 for 15%).",
      id: "waterContentFraction",
      kind: "number",
      label: "Water content",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Dry density in kg/m3.",
      id: "dryDensityKgPerM3",
      kind: "number",
      label: "Dry density",
    },
  ],
  calculate: (input) =>
    calculateDryDensity(input as unknown as DryDensityInput),
});

export const runDryDensity = dryDensityTool.execute;
export default dryDensityTool;
