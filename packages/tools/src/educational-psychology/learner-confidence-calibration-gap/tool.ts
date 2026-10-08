import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reportedConfidence: number;
  readonly observedSuccessFraction: number;
};
export type Output = { readonly signedCalibrationGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reportedConfidence: { type: "number", minimum: 0, maximum: 1 },
    observedSuccessFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["reportedConfidence", "observedSuccessFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedCalibrationGap: { type: "number" } },
  required: ["signedCalibrationGap"],
} as const;
/** Compare a supplied confidence probability with an explicitly observed success fraction without estimating a full calibration curve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reportedConfidence, observedSuccessFraction } = request;
  const compute = (): Output => {
    (H.domain(
      reportedConfidence >= 0 && reportedConfidence <= 1,
      "reportedConfidence",
    ),
      reportedConfidence);
    (H.domain(
      observedSuccessFraction >= 0 && observedSuccessFraction <= 1,
      "observedSuccessFraction",
    ),
      observedSuccessFraction);
    return {
      signedCalibrationGap: reportedConfidence - observedSuccessFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reportedConfidence: 0.8, observedSuccessFraction: 0.6 },
  output: { signedCalibrationGap: 0.20000000000000007 },
} satisfies ToolExample<Input, Output>;
export const learnerConfidenceCalibrationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "educational-psychology",
        "educational psychology",
        "psychology",
      ],
      keywords: ["educational psychology", "psychology"],
    },
    id: "educational-psychology/learner-confidence-calibration-gap",
    title: "Learner Confidence Calibration Gap",
    description:
      "Compare a supplied confidence probability with an explicitly observed success fraction without estimating a full calibration curve.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reportedConfidence: { type: "number", minimum: 0, maximum: 1 },
        observedSuccessFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["reportedConfidence", "observedSuccessFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedCalibrationGap: { type: "number" } },
      required: ["signedCalibrationGap"],
    },
    ports: {
      inputs: [
        {
          id: "reportedConfidence",
          label: "Reported Confidence",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedSuccessFraction",
          label: "Observed Success Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedCalibrationGap",
          label: "Signed Calibration Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = learnerConfidenceCalibrationGapTool.execute;
export default learnerConfidenceCalibrationGapTool;
