import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpecificGravityInput = {
  readonly solidDensityKgPerM3: number;
  readonly waterDensityKgPerM3?: number;
};

export type SpecificGravityOutput = {
  readonly specificGravity: number;
};

export const calculateSpecificGravity = (
  input: SpecificGravityInput,
): SpecificGravityOutput => {
  const waterDensityKgPerM3 = input.waterDensityKgPerM3 ?? 1000;
  if (!(input.solidDensityKgPerM3 > 0))
    simpleError(
      "solidDensityKgPerM3",
      "Solid density must be greater than zero.",
      "invalid_density",
    );
  if (!(waterDensityKgPerM3 > 0))
    simpleError(
      "waterDensityKgPerM3",
      "Water density must be greater than zero.",
      "invalid_density",
    );
  return { specificGravity: input.solidDensityKgPerM3 / waterDensityKgPerM3 };
};

export const specificGravityExample = {
  input: { solidDensityKgPerM3: 2650, waterDensityKgPerM3: 1000 },
  output: { specificGravity: 2.65 },
} satisfies ToolExample<SpecificGravityInput, SpecificGravityOutput>;

export const specificGravityTool = createSimpleTool({
  id: "geology/specific-gravity",
  title: "Specific Gravity Calculator",
  description:
    "Compute the specific gravity of soil or rock solids as the ratio of particle density to water density.",
  inputs: [
    {
      description: "Density of the solid particles in kg/m3.",
      id: "solidDensityKgPerM3",
      kind: "number",
      label: "Solid density",
      minimum: 0,
    },
    {
      default: 1000,
      description: "Reference water density in kg/m3 (default 1000 at 4 C).",
      id: "waterDensityKgPerM3",
      kind: "number",
      label: "Water density",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Specific gravity (dimensionless).",
      id: "specificGravity",
      kind: "number",
      label: "Specific gravity",
    },
  ],
  calculate: (input) =>
    calculateSpecificGravity(input as unknown as SpecificGravityInput),
});

export const runSpecificGravity = specificGravityTool.execute;
export default specificGravityTool;
