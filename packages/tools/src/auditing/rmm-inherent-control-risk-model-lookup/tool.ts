import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RmmRiskMatrixInput = {
  readonly impact: number;
  readonly likelihood: number;
  readonly moderateUpperPercent: number;
  readonly lowUpperPercent: number;
  readonly riskMatrix: ReadonlyArray<ReadonlyArray<number>>;
};

export type RmmRiskMatrixOutput = {
  readonly classification: "critical" | "high" | "low" | "moderate";
  readonly riskScorePercent: number;
};

export const lookupRmmInherentRisk = (
  input: RmmRiskMatrixInput,
): RmmRiskMatrixOutput => {
  for (const [field, value] of [
    ["likelihood", input.likelihood],
    ["impact", input.impact],
  ] as const)
    if (!Number.isSafeInteger(value) || value < 1 || value > 5)
      simpleError(
        field,
        `${field} must be a whole number from 1 through 5.`,
        "invalid_risk_axis",
      );
  for (const [field, value] of [
    ["lowUpperPercent", input.lowUpperPercent],
    ["moderateUpperPercent", input.moderateUpperPercent],
  ] as const)
    if (!Number.isFinite(value) || value < 0 || value > 100)
      simpleError(
        field,
        `${field} must be from 0 through 100.`,
        "invalid_risk_threshold",
      );
  if (input.lowUpperPercent >= input.moderateUpperPercent)
    simpleError(
      "moderateUpperPercent",
      "The moderate threshold must exceed the low threshold.",
      "invalid_risk_thresholds",
    );
  if (!Array.isArray(input.riskMatrix) || input.riskMatrix.length !== 5)
    simpleError(
      "riskMatrix",
      "The risk matrix must contain five rows.",
      "invalid_risk_matrix",
    );
  for (const [rowIndex, row] of input.riskMatrix.entries()) {
    if (!Array.isArray(row) || row.length !== 5)
      simpleError(
        `riskMatrix.${rowIndex}`,
        "Each risk-matrix row must contain five values.",
        "invalid_risk_matrix",
      );
    for (const [columnIndex, value] of row.entries())
      if (!Number.isFinite(value) || value < 0 || value > 100)
        simpleError(
          `riskMatrix.${rowIndex}.${columnIndex}`,
          "Risk scores must be from 0 through 100 percent.",
          "invalid_risk_score",
        );
  }
  const riskScorePercent =
    input.riskMatrix[input.likelihood - 1]![input.impact - 1]!;
  return {
    classification:
      riskScorePercent < input.lowUpperPercent
        ? "low"
        : riskScorePercent < input.moderateUpperPercent
          ? "moderate"
          : riskScorePercent === 100
            ? "critical"
            : "high",
    riskScorePercent,
  };
};

export const rmmRiskMatrixExample = {
  input: {
    impact: 5,
    likelihood: 5,
    moderateUpperPercent: 50,
    lowUpperPercent: 20,
    riskMatrix: [
      [5, 10, 20, 30, 40],
      [10, 20, 30, 40, 50],
      [20, 30, 40, 60, 70],
      [30, 40, 60, 80, 90],
      [40, 50, 70, 90, 100],
    ],
  },
  output: { classification: "critical", riskScorePercent: 100 },
} satisfies ToolExample<RmmRiskMatrixInput, RmmRiskMatrixOutput>;

export const rmmRiskMatrixTool = createSimpleTool({
  calculate: (input) =>
    lookupRmmInherentRisk({
      impact: input.impact as number,
      likelihood: input.likelihood as number,
      moderateUpperPercent: input.moderateUpperPercent as number,
      lowUpperPercent: input.lowUpperPercent as number,
      riskMatrix: input.riskMatrix as number[][],
    }),
  description:
    "Read a caller-supplied five-by-five likelihood-impact matrix and classify the selected inherent-risk score using explicit percentage thresholds.",
  id: "auditing/rmm-inherent-control-risk-model-lookup",
  inputs: [
    {
      id: "impact",
      kind: "integer",
      label: "Impact rating",
      maximum: 5,
      minimum: 1,
    },
    {
      id: "likelihood",
      kind: "integer",
      label: "Likelihood rating",
      maximum: 5,
      minimum: 1,
    },
    {
      id: "lowUpperPercent",
      kind: "number",
      label: "Low-risk upper threshold",
      maximum: 100,
      minimum: 0,
    },
    {
      id: "moderateUpperPercent",
      kind: "number",
      label: "Moderate-risk upper threshold",
      maximum: 100,
      minimum: 0,
    },
    {
      description:
        "Five rows and five columns of risk scores from 0 through 100.",
      id: "riskMatrix",
      kind: "matrix",
      label: "Risk matrix",
    },
  ],
  outputs: [
    {
      enum: ["critical", "high", "low", "moderate"],
      id: "classification",
      kind: "string",
      label: "Risk classification",
    },
    {
      id: "riskScorePercent",
      kind: "number",
      label: "Risk score",
      maximum: 100,
      minimum: 0,
      unit: "percent",
    },
  ],
  title: "RMM Inherent Control Risk Model Lookup",
});

export const runRmmRiskMatrix = rmmRiskMatrixTool.execute;
export default rmmRiskMatrixTool;
