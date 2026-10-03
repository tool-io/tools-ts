import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly clusterWeights: readonly number[];
  readonly targetTotal: number;
  readonly index: number;
};
export type Output = {
  readonly normalizedWeights: readonly number[];
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clusterWeights: { type: "array", maxItems: 256, items: { type: "number" } },
    targetTotal: { type: "number", minimum: 0 },
    index: { type: "integer", minimum: 0 },
  },
  required: ["clusterWeights", "targetTotal", "index"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedWeights: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    contribution: { type: "number" },
  },
  required: ["normalizedWeights", "contribution"],
} as const;
/** Calculate health survey cluster weight normalizer from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clusterWeights, targetTotal, index } = request;
  const compute = (): Output => {
    H.domain(
      clusterWeights.length > 0 &&
        clusterWeights.every((x) => x >= 0) &&
        clusterWeights.reduce((a, b) => a + b, 0) > 0 &&
        targetTotal >= 0,
    );
    H.integer(index, 0, clusterWeights.length - 1);
    return {
      normalizedWeights: clusterWeights.map(
        (x) => (x * targetTotal) / clusterWeights.reduce((a, b) => a + b, 0),
      ),
      contribution:
        (clusterWeights[index] * targetTotal) /
        clusterWeights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { clusterWeights: [2, 3, 5], targetTotal: 100, index: 1 },
  output: { normalizedWeights: [20, 30, 50], contribution: 30 },
} satisfies ToolExample<Input, Output>;
export const healthSurveyClusterWeightNormalizerTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-health/health-survey-cluster-weight-normalizer",
      title: "Health Survey Cluster Weight Normalizer Tool",
      description:
        "Calculate health survey cluster weight normalizer from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          clusterWeights: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          targetTotal: { type: "number", minimum: 0 },
          index: { type: "integer", minimum: 0 },
        },
        required: ["clusterWeights", "targetTotal", "index"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          normalizedWeights: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          contribution: { type: "number" },
        },
        required: ["normalizedWeights", "contribution"],
      },
      ports: {
        inputs: [
          {
            id: "clusterWeights",
            label: "Cluster Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "targetTotal",
            label: "Target Total",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "index",
            label: "Index",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "normalizedWeights",
            label: "Normalized Weights",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "contribution",
            label: "Contribution",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthSurveyClusterWeightNormalizerTool.execute;
export default healthSurveyClusterWeightNormalizerTool;
