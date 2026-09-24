import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly truePositiveGain: number;
  readonly falsePositiveCost: number;
};
export type Output = { readonly threshold: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    truePositiveGain: { type: "number", minimum: 0 },
    falsePositiveCost: { type: "number", minimum: 0 },
  },
  required: ["truePositiveGain", "falsePositiveCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { threshold: { type: "number" } },
  required: ["threshold"],
} as const;
/** Calculate threshold utility indifference probability from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { truePositiveGain, falsePositiveCost } = request;
  const compute = (): Output => {
    H.domain(
      truePositiveGain >= 0 &&
        falsePositiveCost >= 0 &&
        truePositiveGain + falsePositiveCost > 0,
    );
    return {
      threshold: falsePositiveCost / (truePositiveGain + falsePositiveCost),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { truePositiveGain: 3, falsePositiveCost: 1 },
  output: { threshold: 0.25 },
} satisfies ToolExample<Input, Output>;
export const thresholdUtilityIndifferenceProbabilityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "classification/threshold-utility-indifference-probability",
      title: "Threshold Utility Indifference Probability Tool",
      description:
        "Calculate threshold utility indifference probability from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          truePositiveGain: { type: "number", minimum: 0 },
          falsePositiveCost: { type: "number", minimum: 0 },
        },
        required: ["truePositiveGain", "falsePositiveCost"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { threshold: { type: "number" } },
        required: ["threshold"],
      },
      ports: {
        inputs: [
          {
            id: "truePositiveGain",
            label: "True Positive Gain",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "falsePositiveCost",
            label: "False Positive Cost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "threshold",
            label: "Threshold",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = thresholdUtilityIndifferenceProbabilityTool.execute;
export default thresholdUtilityIndifferenceProbabilityTool;
