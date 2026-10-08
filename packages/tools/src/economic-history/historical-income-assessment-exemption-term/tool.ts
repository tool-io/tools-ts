import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedIncome: number;
  readonly suppliedExemption: number;
};
export type Output = {
  readonly rawAssessableIncome: number;
  readonly nonnegativeAssessableIncome: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedIncome: { type: "number", minimum: 0 },
    suppliedExemption: { type: "number", minimum: 0 },
  },
  required: ["recordedIncome", "suppliedExemption"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawAssessableIncome: { type: "number" },
    nonnegativeAssessableIncome: { type: "number" },
  },
  required: ["rawAssessableIncome", "nonnegativeAssessableIncome"],
} as const;
/** Subtract an explicitly supplied historical income exemption and show raw and zero-floor bases without determining tax law. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedIncome, suppliedExemption } = request;
  const compute = (): Output => {
    H.domain(recordedIncome >= 0, "recordedIncome");
    H.domain(suppliedExemption >= 0, "suppliedExemption");
    return {
      rawAssessableIncome: recordedIncome - suppliedExemption,
      nonnegativeAssessableIncome: Math.max(
        0,
        recordedIncome - suppliedExemption,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedIncome: 120, suppliedExemption: 30 },
  output: { rawAssessableIncome: 90, nonnegativeAssessableIncome: 90 },
} satisfies ToolExample<Input, Output>;
export const historicalIncomeAssessmentExemptionTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "economic-history/historical-income-assessment-exemption-term",
      title: "Historical Income Assessment Exemption Term Tool",
      description:
        "Subtract an explicitly supplied historical income exemption and show raw and zero-floor bases without determining tax law.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedIncome: { type: "number", minimum: 0 },
          suppliedExemption: { type: "number", minimum: 0 },
        },
        required: ["recordedIncome", "suppliedExemption"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawAssessableIncome: { type: "number" },
          nonnegativeAssessableIncome: { type: "number" },
        },
        required: ["rawAssessableIncome", "nonnegativeAssessableIncome"],
      },
      ports: {
        inputs: [
          {
            id: "recordedIncome",
            label: "Recorded Income",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedExemption",
            label: "Supplied Exemption",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "rawAssessableIncome",
            label: "Raw Assessable Income",
            valueType: { type: "number" },
          },
          {
            id: "nonnegativeAssessableIncome",
            label: "Nonnegative Assessable Income",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = historicalIncomeAssessmentExemptionTermTool.execute;
export default historicalIncomeAssessmentExemptionTermTool;
