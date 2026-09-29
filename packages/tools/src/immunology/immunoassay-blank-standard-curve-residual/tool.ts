import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly blank: number;
  readonly predictedBlankCorrected: number;
  readonly signalSd: number;
};
export type Output = {
  readonly blankCorrected: number;
  readonly residual: number;
  readonly standardizedResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    blank: { type: "number" },
    predictedBlankCorrected: { type: "number" },
    signalSd: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observed", "blank", "predictedBlankCorrected", "signalSd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blankCorrected: { type: "number" },
    residual: { type: "number" },
    standardizedResidual: { type: "number" },
  },
  required: ["blankCorrected", "residual", "standardizedResidual"],
} as const;
/** Residual from an externally fitted blank-corrected calibration curve; no assay curve is fitted or concentration inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, blank, predictedBlankCorrected, signalSd } = request;
  const compute = (): Output => {
    H.positive(signalSd);
    return {
      blankCorrected: observed - blank,
      residual: observed - blank - predictedBlankCorrected,
      standardizedResidual:
        (observed - blank - predictedBlankCorrected) / signalSd,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 120, blank: 20, predictedBlankCorrected: 90, signalSd: 5 },
  output: { blankCorrected: 100, residual: 10, standardizedResidual: 2 },
} satisfies ToolExample<Input, Output>;
export const immunoassayBlankStandardCurveResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/immunoassay-blank-standard-curve-residual",
      title: "Immunoassay Blank Standard Curve Residual Tool",
      description:
        "Residual from an externally fitted blank-corrected calibration curve; no assay curve is fitted or concentration inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "number" },
          blank: { type: "number" },
          predictedBlankCorrected: { type: "number" },
          signalSd: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["observed", "blank", "predictedBlankCorrected", "signalSd"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          blankCorrected: { type: "number" },
          residual: { type: "number" },
          standardizedResidual: { type: "number" },
        },
        required: ["blankCorrected", "residual", "standardizedResidual"],
      },
      ports: {
        inputs: [
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blank",
            label: "Blank",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "predictedBlankCorrected",
            label: "Predicted Blank Corrected",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "signalSd",
            label: "Signal Sd",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "blankCorrected",
            label: "Blank Corrected",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
          {
            id: "standardizedResidual",
            label: "Standardized Residual",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = immunoassayBlankStandardCurveResidualTool.execute;
export default immunoassayBlankStandardCurveResidualTool;
