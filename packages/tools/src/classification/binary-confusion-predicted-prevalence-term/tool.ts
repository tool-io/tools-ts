import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly truePositive: number;
  readonly falsePositive: number;
  readonly total: number;
};
export type Output = {
  readonly predictedPositive: number;
  readonly prevalence: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    truePositive: { type: "integer", minimum: 0 },
    falsePositive: { type: "integer", minimum: 0 },
    total: { type: "integer", minimum: 1 },
  },
  required: ["truePositive", "falsePositive", "total"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedPositive: { type: "integer" },
    prevalence: { type: "number" },
  },
  required: ["predictedPositive", "prevalence"],
} as const;
/** Calculate binary confusion predicted prevalence term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { truePositive, falsePositive, total } = request;
  const compute = (): Output => {
    H.integer(truePositive, 0);
    H.integer(falsePositive, 0);
    H.integer(total, 1);
    const predictedPositive = truePositive + falsePositive;
    H.domain(predictedPositive <= total);
    return { predictedPositive, prevalence: predictedPositive / total };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { truePositive: 30, falsePositive: 10, total: 100 },
  output: { predictedPositive: 40, prevalence: 0.4 },
} satisfies ToolExample<Input, Output>;
export const binaryConfusionPredictedPrevalenceTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "classification/binary-confusion-predicted-prevalence-term",
      title: "Binary Confusion Predicted Prevalence Term Tool",
      description:
        "Calculate binary confusion predicted prevalence term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          truePositive: { type: "integer", minimum: 0 },
          falsePositive: { type: "integer", minimum: 0 },
          total: { type: "integer", minimum: 1 },
        },
        required: ["truePositive", "falsePositive", "total"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          predictedPositive: { type: "integer" },
          prevalence: { type: "number" },
        },
        required: ["predictedPositive", "prevalence"],
      },
      ports: {
        inputs: [
          {
            id: "truePositive",
            label: "True Positive",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "falsePositive",
            label: "False Positive",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "total",
            label: "Total",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "predictedPositive",
            label: "Predicted Positive",
            valueType: { type: "integer" },
          },
          {
            id: "prevalence",
            label: "Prevalence",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = binaryConfusionPredictedPrevalenceTermTool.execute;
export default binaryConfusionPredictedPrevalenceTermTool;
