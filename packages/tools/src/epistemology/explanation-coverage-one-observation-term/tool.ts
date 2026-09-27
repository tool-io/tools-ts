import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly predicted: boolean;
  readonly observed: boolean;
  readonly importance: number;
  readonly totalImportance: number;
};
export type Output = {
  readonly coveredWeight: number;
  readonly unexplainedWeight: number;
  readonly coverageContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predicted: { type: "boolean" },
    observed: { type: "boolean" },
    importance: { type: "number", minimum: 0 },
    totalImportance: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["predicted", "observed", "importance", "totalImportance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredWeight: { type: "number" },
    unexplainedWeight: { type: "number" },
    coverageContribution: { type: "number" },
  },
  required: ["coveredWeight", "unexplainedWeight", "coverageContribution"],
} as const;
/** Descriptive caller-coded explanation coverage contribution, without a probabilistic explanatory-power claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { predicted, observed, importance, totalImportance } = request;
  const compute = (): Output => {
    H.positive(totalImportance);
    H.domain(importance >= 0 && importance <= totalImportance);
    return {
      coveredWeight: predicted && observed ? importance : 0,
      unexplainedWeight: !predicted && observed ? importance : 0,
      coverageContribution:
        predicted && observed ? importance / totalImportance : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    predicted: true,
    observed: true,
    importance: 3,
    totalImportance: 10,
  },
  output: { coveredWeight: 3, unexplainedWeight: 0, coverageContribution: 0.3 },
} satisfies ToolExample<Input, Output>;
export const explanationCoverageOneObservationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epistemology/explanation-coverage-one-observation-term",
      title: "Explanation Coverage One Observation Term Tool",
      description:
        "Descriptive caller-coded explanation coverage contribution, without a probabilistic explanatory-power claim.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          predicted: { type: "boolean" },
          observed: { type: "boolean" },
          importance: { type: "number", minimum: 0 },
          totalImportance: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["predicted", "observed", "importance", "totalImportance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coveredWeight: { type: "number" },
          unexplainedWeight: { type: "number" },
          coverageContribution: { type: "number" },
        },
        required: [
          "coveredWeight",
          "unexplainedWeight",
          "coverageContribution",
        ],
      },
      ports: {
        inputs: [
          {
            id: "predicted",
            label: "Predicted",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "importance",
            label: "Importance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalImportance",
            label: "Total Importance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "coveredWeight",
            label: "Covered Weight",
            valueType: { type: "number" },
          },
          {
            id: "unexplainedWeight",
            label: "Unexplained Weight",
            valueType: { type: "number" },
          },
          {
            id: "coverageContribution",
            label: "Coverage Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = explanationCoverageOneObservationTermTool.execute;
export default explanationCoverageOneObservationTermTool;
