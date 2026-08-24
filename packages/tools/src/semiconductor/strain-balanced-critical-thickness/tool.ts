import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StrainBalancedCriticalThicknessInput = {
  readonly bulkCriticalThicknessNm: number;
  readonly residualStrainFraction: number;
};

export type StrainBalancedCriticalThicknessOutput = {
  readonly effectiveCriticalThicknessNm: number;
};

export const strainBalancedCriticalThicknessExample = {
  input: { bulkCriticalThicknessNm: 50, residualStrainFraction: 0.8 },
  output: { effectiveCriticalThicknessNm: 62.5 },
} satisfies ToolExample<
  StrainBalancedCriticalThicknessInput,
  StrainBalancedCriticalThicknessOutput
>;

export const strainBalancedCriticalThicknessTool = createSimpleTool({
  id: "semiconductor/strain-balanced-critical-thickness",
  title: "Strain-Balanced Critical Thickness Calculator",
  description:
    "Estimate strain-balanced critical thickness by scaling the unbalanced value inversely with the nonzero residual strain fraction.",
  inputs: [
    {
      description: "Critical thickness of the unbalanced bulk layer.",
      id: "bulkCriticalThicknessNm",
      kind: "number",
      label: "Bulk critical thickness",
      unit: "nm",
    },
    {
      description:
        "Fraction of the original mismatch strain left after balancing; 1 means no compensation.",
      id: "residualStrainFraction",
      kind: "number",
      label: "Residual strain fraction",
      maximum: 1,
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Effective critical thickness with strain balancing.",
      id: "effectiveCriticalThicknessNm",
      kind: "number",
      label: "Effective critical thickness",
      unit: "nm",
    },
  ],
  calculate: (input) => {
    const bulkCriticalThicknessNm = input.bulkCriticalThicknessNm as number;
    const residualStrainFraction = input.residualStrainFraction as number;
    if (!(bulkCriticalThicknessNm > 0))
      simpleError(
        "bulkCriticalThicknessNm",
        "Bulk critical thickness must be positive.",
        "must_be_positive",
      );
    if (!(residualStrainFraction > 0 && residualStrainFraction <= 1))
      simpleError(
        "residualStrainFraction",
        "Residual strain fraction must be greater than 0 and at most 1.",
        "out_of_range",
      );
    const effectiveCriticalThicknessNm =
      bulkCriticalThicknessNm / residualStrainFraction;
    if (
      !(effectiveCriticalThicknessNm > 0) ||
      !Number.isFinite(effectiveCriticalThicknessNm)
    )
      simpleError(
        "effectiveCriticalThicknessNm",
        "Effective critical thickness must be positive.",
        "must_be_positive",
      );
    return { effectiveCriticalThicknessNm };
  },
});
export const runStrainBalancedCriticalThickness =
  strainBalancedCriticalThicknessTool.execute;
export default strainBalancedCriticalThicknessTool;
