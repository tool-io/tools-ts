import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CurvatureCoefficientInput = {
  readonly d30Mm: number;
  readonly d60Mm: number;
  readonly d10Mm: number;
};

export type CurvatureCoefficientOutput = {
  readonly curvatureCoefficient: number;
};

export const calculateCurvatureCoefficient = (
  input: CurvatureCoefficientInput,
): CurvatureCoefficientOutput => {
  for (const key of ["d30Mm", "d60Mm", "d10Mm"] as const) {
    if (!(input[key] > 0))
      simpleError(
        key,
        "Grain sizes must be greater than zero.",
        "invalid_grain_size",
      );
  }
  return {
    curvatureCoefficient: input.d30Mm ** 2 / (input.d60Mm * input.d10Mm),
  };
};

export const curvatureCoefficientExample = {
  input: { d30Mm: 0.3, d60Mm: 0.85, d10Mm: 0.15 },
  output: { curvatureCoefficient: 0.7058823529411764 },
} satisfies ToolExample<CurvatureCoefficientInput, CurvatureCoefficientOutput>;

export const curvatureCoefficientTool = createSimpleTool({
  id: "geology/curvature-coefficient",
  title: "Curvature Coefficient Calculator",
  description:
    "Compute the gradation curvature coefficient Cc = D30^2 / (D60 * D10) from grain sizes in millimeters read from a gradation curve.",
  inputs: [
    {
      description: "Sieve size at 30 percent finer in millimeters.",
      id: "d30Mm",
      kind: "number",
      label: "D30",
    },
    {
      description: "Sieve size at 60 percent finer in millimeters.",
      id: "d60Mm",
      kind: "number",
      label: "D60",
    },
    {
      description: "Sieve size at 10 percent finer in millimeters.",
      id: "d10Mm",
      kind: "number",
      label: "D10",
    },
  ],
  outputs: [
    {
      description: "Curvature coefficient Cc (dimensionless).",
      id: "curvatureCoefficient",
      kind: "number",
      label: "Cc",
    },
  ],
  calculate: (input) =>
    calculateCurvatureCoefficient(
      input as unknown as CurvatureCoefficientInput,
    ),
});

export const runCurvatureCoefficient = curvatureCoefficientTool.execute;
export default curvatureCoefficientTool;
