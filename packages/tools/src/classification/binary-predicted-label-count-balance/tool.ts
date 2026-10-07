import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly truePositive: number;
  readonly falsePositive: number;
  readonly falseNegative: number;
  readonly trueNegative: number;
};
export type Output = {
  readonly predictedPositive: number;
  readonly predictedNegative: number;
  readonly total: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    truePositive: { type: "integer", minimum: 0 },
    falsePositive: { type: "integer", minimum: 0 },
    falseNegative: { type: "integer", minimum: 0 },
    trueNegative: { type: "integer", minimum: 0 },
  },
  required: ["truePositive", "falsePositive", "falseNegative", "trueNegative"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedPositive: { type: "integer" },
    predictedNegative: { type: "integer" },
    total: { type: "integer" },
  },
  required: ["predictedPositive", "predictedNegative", "total"],
} as const;
/** Reconcile explicit binary confusion counts into predicted-label totals using exact integer arithmetic. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { truePositive, falsePositive, falseNegative, trueNegative } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(truePositive) &&
        truePositive >= 0 &&
        truePositive <= Number.MAX_SAFE_INTEGER,
      "truePositive",
    ),
      truePositive);
    (H.domain(
      Number.isSafeInteger(falsePositive) &&
        falsePositive >= 0 &&
        falsePositive <= Number.MAX_SAFE_INTEGER,
      "falsePositive",
    ),
      falsePositive);
    (H.domain(
      Number.isSafeInteger(falseNegative) &&
        falseNegative >= 0 &&
        falseNegative <= Number.MAX_SAFE_INTEGER,
      "falseNegative",
    ),
      falseNegative);
    (H.domain(
      Number.isSafeInteger(trueNegative) &&
        trueNegative >= 0 &&
        trueNegative <= Number.MAX_SAFE_INTEGER,
      "trueNegative",
    ),
      trueNegative);
    return {
      predictedPositive: Number(BigInt(truePositive) + BigInt(falsePositive)),
      predictedNegative: Number(BigInt(falseNegative) + BigInt(trueNegative)),
      total: Number(
        BigInt(truePositive) +
          BigInt(falsePositive) +
          BigInt(falseNegative) +
          BigInt(trueNegative),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    truePositive: 30,
    falsePositive: 5,
    falseNegative: 10,
    trueNegative: 55,
  },
  output: { predictedPositive: 35, predictedNegative: 65, total: 100 },
} satisfies ToolExample<Input, Output>;
export const binaryPredictedLabelCountBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: ["classification", "classification metrics", "computer science"],
      keywords: ["classification metrics", "computer science"],
    },
    id: "classification/binary-predicted-label-count-balance",
    title: "Binary Predicted Label Count Balance",
    description:
      "Reconcile explicit binary confusion counts into predicted-label totals using exact integer arithmetic.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        truePositive: { type: "integer", minimum: 0 },
        falsePositive: { type: "integer", minimum: 0 },
        falseNegative: { type: "integer", minimum: 0 },
        trueNegative: { type: "integer", minimum: 0 },
      },
      required: [
        "truePositive",
        "falsePositive",
        "falseNegative",
        "trueNegative",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedPositive: { type: "integer" },
        predictedNegative: { type: "integer" },
        total: { type: "integer" },
      },
      required: ["predictedPositive", "predictedNegative", "total"],
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
          id: "falseNegative",
          label: "False Negative",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "trueNegative",
          label: "True Negative",
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
          id: "predictedNegative",
          label: "Predicted Negative",
          valueType: { type: "integer" },
        },
        { id: "total", label: "Total", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = binaryPredictedLabelCountBalanceTool.execute;
export default binaryPredictedLabelCountBalanceTool;
