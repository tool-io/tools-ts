import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const densityTool = createSimpleTool({
  id: "physics/density",
  title: "Density Calculator",
  description: "Compute density as mass divided by volume.",
  inputs: [
    {
      description: "Mass in grams.",
      id: "massG",
      label: "Mass",
      kind: "number",
      minimum: 0,
      unit: "g",
    },
    {
      description: "Volume in cubic centimeters.",
      id: "volumeCm3",
      label: "Volume",
      kind: "number",
      minimum: 0,
      unit: "cm³",
    },
  ],
  outputs: [
    {
      description: "Density in g/cm³.",
      id: "densityGCm3",
      label: "Density",
      kind: "number",
      unit: "g/cm³",
    },
  ],
  calculate: (input) => {
    const v = input.volumeCm3 as number;
    if (v <= 0)
      simpleError(
        "volumeCm3",
        "The volume must be greater than zero.",
        "invalid_volume",
      );
    return { densityGCm3: (input.massG as number) / v };
  },
});
export const runDensity = densityTool.execute;
export default densityTool;

export type DensityInput = {
  readonly massG: number;
  readonly volumeCm3: number;
};

export type DensityOutput = {
  readonly densityGCm3: number;
};

export const densityExample = {
  input: {
    massG: 1,
    volumeCm3: 1,
  },
  output: {
    densityGCm3: 1,
  },
} satisfies ToolExample<DensityInput, DensityOutput>;
