import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly predictedPositive: number;
  readonly truePositive: number;
};
export type Output = { readonly falsePositive: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedPositive: { type: "integer", minimum: 0 },
    truePositive: { type: "integer", minimum: 0 },
  },
  required: ["predictedPositive", "truePositive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { falsePositive: { type: "integer" } },
  required: ["falsePositive"],
} as const;
/** Calculate classwise false discovery count balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { predictedPositive, truePositive } = request;
  const compute = (): Output => {
    H.integer(predictedPositive, 0);
    H.integer(truePositive, 0, predictedPositive);
    return { falsePositive: predictedPositive - truePositive };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { predictedPositive: 40, truePositive: 30 },
  output: { falsePositive: 10 },
} satisfies ToolExample<Input, Output>;
export const classwiseFalseDiscoveryCountBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "classification/classwise-false-discovery-count-balance",
      title: "Classwise False Discovery Count Balance Tool",
      description:
        "Calculate classwise false discovery count balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          predictedPositive: { type: "integer", minimum: 0 },
          truePositive: { type: "integer", minimum: 0 },
        },
        required: ["predictedPositive", "truePositive"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { falsePositive: { type: "integer" } },
        required: ["falsePositive"],
      },
      ports: {
        inputs: [
          {
            id: "predictedPositive",
            label: "Predicted Positive",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "truePositive",
            label: "True Positive",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "falsePositive",
            label: "False Positive",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = classwiseFalseDiscoveryCountBalanceTool.execute;
export default classwiseFalseDiscoveryCountBalanceTool;
