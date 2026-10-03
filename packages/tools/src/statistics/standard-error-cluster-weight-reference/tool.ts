import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly independentError: number;
  readonly designEffect: number;
};
export type Output = { readonly clusterError: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    independentError: { type: "number", minimum: 0 },
    designEffect: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["independentError", "designEffect"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { clusterError: { type: "number" } },
  required: ["clusterError"],
} as const;
/** Calculate standard error cluster weight reference from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { independentError, designEffect } = input;
  const compute = (): Output => {
    H.domain(independentError >= 0);
    H.positive(designEffect);
    return { clusterError: independentError * Math.sqrt(designEffect) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { independentError: 2, designEffect: 4 },
  output: { clusterError: 4 },
} satisfies ToolExample<Input, Output>;
export const standardErrorClusterWeightReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "statistics/standard-error-cluster-weight-reference",
      title: "Standard Error Cluster Weight Reference Tool",
      description:
        "Calculate standard error cluster weight reference from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          independentError: { type: "number", minimum: 0 },
          designEffect: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["independentError", "designEffect"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { clusterError: { type: "number" } },
        required: ["clusterError"],
      },
      ports: {
        inputs: [
          {
            id: "independentError",
            label: "Independent Error",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "designEffect",
            label: "Design Effect",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "clusterError",
            label: "Cluster Error",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = standardErrorClusterWeightReferenceTool.execute;
export default standardErrorClusterWeightReferenceTool;
