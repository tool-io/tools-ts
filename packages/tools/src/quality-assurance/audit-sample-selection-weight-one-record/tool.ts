import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inclusionProbability: number;
  readonly observedValue: number;
  readonly eligiblePopulation: number;
};
export type Output = {
  readonly weight: number;
  readonly totalContribution: number;
  readonly meanContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inclusionProbability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    observedValue: { type: "number" },
    eligiblePopulation: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["inclusionProbability", "observedValue", "eligiblePopulation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weight: { type: "number" },
    totalContribution: { type: "number" },
    meanContribution: { type: "number" },
  },
  required: ["weight", "totalContribution", "meanContribution"],
} as const;
/** One Horvitz-Thompson contribution from a supplied inclusion probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inclusionProbability, observedValue, eligiblePopulation } = request;
  const compute = (): Output => {
    H.domain(inclusionProbability > 0 && inclusionProbability <= 1);
    H.positive(eligiblePopulation);
    return {
      weight: 1 / inclusionProbability,
      totalContribution: observedValue / inclusionProbability,
      meanContribution:
        observedValue / (inclusionProbability * eligiblePopulation),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inclusionProbability: 0.2,
    observedValue: 5,
    eligiblePopulation: 100,
  },
  output: { weight: 5, totalContribution: 25, meanContribution: 0.25 },
} satisfies ToolExample<Input, Output>;
export const auditSampleSelectionWeightOneRecordTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "quality-assurance/audit-sample-selection-weight-one-record",
      title: "Audit Sample Selection Weight One Record Tool",
      description:
        "One Horvitz-Thompson contribution from a supplied inclusion probability.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inclusionProbability: {
            type: "number",
            exclusiveMinimum: 0,
            maximum: 1,
          },
          observedValue: { type: "number" },
          eligiblePopulation: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "inclusionProbability",
          "observedValue",
          "eligiblePopulation",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weight: { type: "number" },
          totalContribution: { type: "number" },
          meanContribution: { type: "number" },
        },
        required: ["weight", "totalContribution", "meanContribution"],
      },
      ports: {
        inputs: [
          {
            id: "inclusionProbability",
            label: "Inclusion Probability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "observedValue",
            label: "Observed Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "eligiblePopulation",
            label: "Eligible Population",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "weight", label: "Weight", valueType: { type: "number" } },
          {
            id: "totalContribution",
            label: "Total Contribution",
            valueType: { type: "number" },
          },
          {
            id: "meanContribution",
            label: "Mean Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = auditSampleSelectionWeightOneRecordTool.execute;
export default auditSampleSelectionWeightOneRecordTool;
