import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly clusterId: string;
  readonly regressor: number;
  readonly residual: number;
};
export type Output = {
  readonly clusterId: string;
  readonly scoreContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusterId: { type: "string", maxLength: 8192, minLength: 1 },
    regressor: { type: "number" },
    residual: { type: "number" },
  },
  required: ["clusterId", "regressor", "residual"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusterId: { type: "string", maxLength: 8192 },
    scoreContribution: { type: "number" },
  },
  required: ["clusterId", "scoreContribution"],
} as const;
/** Attach one supplied unweighted scalar observation score to its explicit cluster identifier without summing clusters or estimating covariance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clusterId, regressor, residual } = request;
  const compute = (): Output => {
    H.domain(clusterId.length > 0, "clusterId");
    return { clusterId, scoreContribution: regressor * residual };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { clusterId: "G17", regressor: 2, residual: 3 },
  output: { clusterId: "G17", scoreContribution: 6 },
} satisfies ToolExample<Input, Output>;
export const clusteredScoreSingleObservationContributionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "econometrics/clustered-score-single-observation-contribution",
      title: "Clustered Score Single Observation Contribution Tool",
      description:
        "Attach one supplied unweighted scalar observation score to its explicit cluster identifier without summing clusters or estimating covariance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          clusterId: { type: "string", maxLength: 8192, minLength: 1 },
          regressor: { type: "number" },
          residual: { type: "number" },
        },
        required: ["clusterId", "regressor", "residual"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          clusterId: { type: "string", maxLength: 8192 },
          scoreContribution: { type: "number" },
        },
        required: ["clusterId", "scoreContribution"],
      },
      ports: {
        inputs: [
          {
            id: "clusterId",
            label: "Cluster Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "regressor",
            label: "Regressor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "residual",
            label: "Residual",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "clusterId",
            label: "Cluster Id",
            valueType: { type: "string" },
          },
          {
            id: "scoreContribution",
            label: "Score Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = clusteredScoreSingleObservationContributionTool.execute;
export default clusteredScoreSingleObservationContributionTool;
