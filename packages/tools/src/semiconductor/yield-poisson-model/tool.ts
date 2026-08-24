import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type YieldPoissonModelInput = {
  readonly defectDensityPerCm2: number;
  readonly dieAreaCm2: number;
};

export type YieldPoissonModelOutput = {
  readonly yieldPercent: number;
};

export const yieldPoissonModelExample = {
  input: { defectDensityPerCm2: 0.1, dieAreaCm2: 1 },
  output: { yieldPercent: 90.48374180359595 },
} satisfies ToolExample<YieldPoissonModelInput, YieldPoissonModelOutput>;

export const yieldPoissonModelTool = createSimpleTool({
  calculate: (input) => {
    const defectDensityPerCm2 = input.defectDensityPerCm2 as number;
    const dieAreaCm2 = input.dieAreaCm2 as number;
    if (!(dieAreaCm2 > 0))
      simpleError(
        "dieAreaCm2",
        "Die area must be positive.",
        "degenerate_input",
      );
    return {
      yieldPercent: Math.exp(-defectDensityPerCm2 * dieAreaCm2) * 100,
    };
  },
  description:
    "Compute chip yield from defect density and die area with the Poisson model.",
  id: "semiconductor/yield-poisson-model",
  inputs: [
    {
      id: "defectDensityPerCm2",
      kind: "number",
      label: "Defect density",
      minimum: 0,
      unit: "defects/cm^2",
    },
    {
      id: "dieAreaCm2",
      kind: "number",
      label: "Die area",
      unit: "cm^2",
    },
  ],
  outputs: [
    {
      id: "yieldPercent",
      kind: "number",
      label: "Yield",
      unit: "%",
    },
  ],
  title: "Poisson Yield Model",
});
export const runYieldPoissonModel = yieldPoissonModelTool.execute;
export default yieldPoissonModelTool;
