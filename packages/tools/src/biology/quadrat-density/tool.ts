import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type QuadratDensityInput = {
  readonly organismsCounted: number;
  readonly quadratAreaM2: number;
};

export type QuadratDensityOutput = {
  readonly densityPerSquareMeter: number;
};

export const quadratDensityExample = {
  input: { organismsCounted: 48, quadratAreaM2: 12 },
  output: { densityPerSquareMeter: 4 },
} satisfies ToolExample<QuadratDensityInput, QuadratDensityOutput>;

export const quadratDensityTool = createSimpleTool({
  id: "biology/quadrat-density",
  title: "Quadrat Density",
  description:
    "Compute organism density as the counted individuals divided by the quadrat area.",
  inputs: [
    {
      id: "organismsCounted",
      kind: "integer",
      label: "Organisms counted",
      minimum: 0,
      unit: "individuals",
    },
    {
      id: "quadratAreaM2",
      kind: "number",
      label: "Quadrat area",
      minimum: Number.MIN_VALUE,
      unit: "m2",
    },
  ],
  outputs: [
    {
      id: "densityPerSquareMeter",
      kind: "number",
      label: "Density",
      unit: "individuals/m2",
    },
  ],
  calculate: (input) => ({
    densityPerSquareMeter:
      (input.organismsCounted as number) / (input.quadratAreaM2 as number),
  }),
});
export const runQuadratDensity = quadratDensityTool.execute;
export default quadratDensityTool;
