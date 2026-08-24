import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type YieldNegativeBinomialInput = {
  readonly clusterFactorAlpha: number;
  readonly defectDensityPerCm2: number;
  readonly dieAreaCm2: number;
};

export type YieldNegativeBinomialOutput = {
  readonly yieldPercent: number;
};

export const yieldNegativeBinomialExample = {
  input: { clusterFactorAlpha: 2, defectDensityPerCm2: 0.1, dieAreaCm2: 1 },
  output: { yieldPercent: 90.702947845805 },
} satisfies ToolExample<
  YieldNegativeBinomialInput,
  YieldNegativeBinomialOutput
>;

export const yieldNegativeBinomialTool = createSimpleTool({
  calculate: (input) => {
    const clusterFactorAlpha = input.clusterFactorAlpha as number;
    const defectDensityPerCm2 = input.defectDensityPerCm2 as number;
    const dieAreaCm2 = input.dieAreaCm2 as number;
    if (!(dieAreaCm2 > 0))
      simpleError(
        "dieAreaCm2",
        "Die area must be positive.",
        "degenerate_input",
      );
    if (!(clusterFactorAlpha > 0))
      simpleError(
        "clusterFactorAlpha",
        "Cluster factor must be positive.",
        "degenerate_input",
      );
    return {
      yieldPercent:
        Math.exp(
          -clusterFactorAlpha *
            Math.log1p((defectDensityPerCm2 * dieAreaCm2) / clusterFactorAlpha),
        ) * 100,
    };
  },
  description:
    "Compute chip yield from defect density and die area with the negative binomial clustering model.",
  id: "semiconductor/yield-negative-binomial",
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
    {
      id: "clusterFactorAlpha",
      kind: "number",
      label: "Cluster factor",
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
  title: "Negative Binomial Yield Model",
});
export const runYieldNegativeBinomial = yieldNegativeBinomialTool.execute;
export default yieldNegativeBinomialTool;
