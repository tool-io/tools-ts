import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DefectDensityFromYieldInput = {
  readonly dieAreaCm2: number;
  readonly yieldPercent: number;
};

export type DefectDensityFromYieldOutput = {
  readonly defectDensityPerCm2: number;
};

export const defectDensityFromYieldExample = {
  input: { dieAreaCm2: 1, yieldPercent: 90 },
  output: { defectDensityPerCm2: 0.10536051565782631 },
} satisfies ToolExample<
  DefectDensityFromYieldInput,
  DefectDensityFromYieldOutput
>;

export const calculateDefectDensityFromYield = (
  input: DefectDensityFromYieldInput,
): DefectDensityFromYieldOutput => {
  const dieAreaCm2 = input.dieAreaCm2;
  const yieldPercent = input.yieldPercent;

  if (!Number.isFinite(dieAreaCm2) || dieAreaCm2 <= 0)
    simpleError(
      "dieAreaCm2",
      "Die area must be a finite positive number.",
      "degenerate_input",
    );
  if (!Number.isFinite(yieldPercent) || yieldPercent <= 0 || yieldPercent > 100)
    simpleError(
      "yieldPercent",
      "Yield percent must be a finite number greater than 0 and at most 100.",
      "invalid_yield",
    );

  // log1p retains information for yields extremely close to 100%.
  const defectFraction = (100 - yieldPercent) / 100;
  const defectDensityPerCm2 = -Math.log1p(-defectFraction) / dieAreaCm2;
  if (!Number.isFinite(defectDensityPerCm2))
    simpleError("dieAreaCm2", "Defect density overflowed.", "numeric_overflow");

  return {
    defectDensityPerCm2: defectDensityPerCm2 === 0 ? 0 : defectDensityPerCm2,
  };
};

export const defectDensityFromYieldTool = createSimpleTool({
  calculate: (input) =>
    calculateDefectDensityFromYield({
      dieAreaCm2: input.dieAreaCm2 as number,
      yieldPercent: input.yieldPercent as number,
    }),
  description:
    "Infer defect density from measured chip yield and die area using the Poisson yield model. Formula: D0 [cm^-2] = -ln(Y [%]/100) / A [cm²], where Y is the measured die yield and A is the die area. Inputs: 0 < Y < 100 %, A > 0 cm². Output: D0 ≥ 0 cm^-2. Assumes uniformly random defects, Poisson statistics, and that every defect kills a die.",
  id: "semiconductor/defect-density-from-yield",
  inputs: [
    {
      description:
        "Measured die yield. Must be greater than 0 and at most 100%; exactly 100% yields zero inferred defects.",
      id: "yieldPercent",
      kind: "number",
      label: "Measured yield",
      maximum: 100,
      minimum: Number.MIN_VALUE,
      unit: "%",
    },
    {
      description: "Die area. Must be greater than 0 cm².",
      id: "dieAreaCm2",
      kind: "number",
      label: "Die area",
      minimum: Number.MIN_VALUE,
      unit: "cm^2",
    },
  ],
  outputs: [
    {
      description: "Extracted defect density. At least 0 cm^-2.",
      id: "defectDensityPerCm2",
      kind: "number",
      label: "Defect density",
      minimum: 0,
      unit: "defects/cm^2",
    },
  ],
  title: "Defect Density from Yield",
});
export const runDefectDensityFromYield = defectDensityFromYieldTool.execute;
export default defectDensityFromYieldTool;
