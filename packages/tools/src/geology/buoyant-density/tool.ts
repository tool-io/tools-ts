import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BuoyantDensityInput = {
  readonly saturatedDensityKgPerM3: number;
  readonly waterDensityKgPerM3?: number;
};

export type BuoyantDensityOutput = {
  readonly buoyantDensityKgPerM3: number;
};

export const calculateBuoyantDensity = (
  input: BuoyantDensityInput,
): BuoyantDensityOutput => {
  const waterDensityKgPerM3 = input.waterDensityKgPerM3 ?? 1000;
  if (!(input.saturatedDensityKgPerM3 > 0))
    simpleError(
      "saturatedDensityKgPerM3",
      "Saturated density must be greater than zero.",
      "invalid_density",
    );
  if (!(waterDensityKgPerM3 > 0))
    simpleError(
      "waterDensityKgPerM3",
      "Water density must be greater than zero.",
      "invalid_density",
    );
  if (input.saturatedDensityKgPerM3 <= waterDensityKgPerM3)
    simpleError(
      "saturatedDensityKgPerM3",
      "Saturated density must exceed the water density for a submerged unit.",
      "invalid_density",
    );
  return {
    buoyantDensityKgPerM3: input.saturatedDensityKgPerM3 - waterDensityKgPerM3,
  };
};

export const buoyantDensityExample = {
  input: { saturatedDensityKgPerM3: 2031.25, waterDensityKgPerM3: 1000 },
  output: { buoyantDensityKgPerM3: 1031.25 },
} satisfies ToolExample<BuoyantDensityInput, BuoyantDensityOutput>;

export const buoyantDensityTool = createSimpleTool({
  id: "geology/buoyant-density",
  title: "Buoyant Density Calculator",
  description:
    "Compute the buoyant (submerged) density of a saturated soil or rock as saturated density minus water density.",
  inputs: [
    {
      description: "Saturated bulk density in kg/m3.",
      id: "saturatedDensityKgPerM3",
      kind: "number",
      label: "Saturated density",
      minimum: 0,
    },
    {
      default: 1000,
      description: "Water density in kg/m3 (default 1000).",
      id: "waterDensityKgPerM3",
      kind: "number",
      label: "Water density",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Buoyant (submerged) density in kg/m3.",
      id: "buoyantDensityKgPerM3",
      kind: "number",
      label: "Buoyant density",
    },
  ],
  calculate: (input) =>
    calculateBuoyantDensity(input as unknown as BuoyantDensityInput),
});

export const runBuoyantDensity = buoyantDensityTool.execute;
export default buoyantDensityTool;
