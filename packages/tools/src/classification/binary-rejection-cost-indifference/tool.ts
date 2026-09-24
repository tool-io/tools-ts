import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly positiveProbability: number;
  readonly falsePositiveCost: number;
  readonly falseNegativeCost: number;
  readonly rejectionCost: number;
};
export type Output = {
  readonly negativeRisk: number;
  readonly positiveRisk: number;
  readonly rejectRisk: number;
  readonly tiedActions: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveProbability: { type: "number", minimum: 0, maximum: 1 },
    falsePositiveCost: { type: "number", minimum: 0 },
    falseNegativeCost: { type: "number", minimum: 0 },
    rejectionCost: { type: "number", minimum: 0 },
  },
  required: [
    "positiveProbability",
    "falsePositiveCost",
    "falseNegativeCost",
    "rejectionCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    negativeRisk: { type: "number" },
    positiveRisk: { type: "number" },
    rejectRisk: { type: "number" },
    tiedActions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["negativeRisk", "positiveRisk", "rejectRisk", "tiedActions"],
} as const;
/** Compare action risks and exact indifference with a caller-supplied rejection cost. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    positiveProbability,
    falsePositiveCost,
    falseNegativeCost,
    rejectionCost,
  } = request;
  const compute = (): Output => {
    H.probability(positiveProbability);
    H.domain(
      falsePositiveCost >= 0 && falseNegativeCost >= 0 && rejectionCost >= 0,
    );
    return {
      negativeRisk: positiveProbability * falseNegativeCost,
      positiveRisk: (1 - positiveProbability) * falsePositiveCost,
      rejectRisk: rejectionCost,
      tiedActions: [
        ...(positiveProbability * falseNegativeCost === rejectionCost
          ? ["negative"]
          : []),
        ...((1 - positiveProbability) * falsePositiveCost === rejectionCost
          ? ["positive"]
          : []),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    positiveProbability: 0.5,
    falsePositiveCost: 2,
    falseNegativeCost: 2,
    rejectionCost: 1,
  },
  output: {
    negativeRisk: 1,
    positiveRisk: 1,
    rejectRisk: 1,
    tiedActions: ["negative", "positive"],
  },
} satisfies ToolExample<Input, Output>;
export const binaryRejectionCostIndifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/binary-rejection-cost-indifference",
    title: "Binary Rejection Cost Indifference Tool",
    description:
      "Compare action risks and exact indifference with a caller-supplied rejection cost.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveProbability: { type: "number", minimum: 0, maximum: 1 },
        falsePositiveCost: { type: "number", minimum: 0 },
        falseNegativeCost: { type: "number", minimum: 0 },
        rejectionCost: { type: "number", minimum: 0 },
      },
      required: [
        "positiveProbability",
        "falsePositiveCost",
        "falseNegativeCost",
        "rejectionCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        negativeRisk: { type: "number" },
        positiveRisk: { type: "number" },
        rejectRisk: { type: "number" },
        tiedActions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["negativeRisk", "positiveRisk", "rejectRisk", "tiedActions"],
    },
    ports: {
      inputs: [
        {
          id: "positiveProbability",
          label: "Positive Probability",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "falsePositiveCost",
          label: "False Positive Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "falseNegativeCost",
          label: "False Negative Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rejectionCost",
          label: "Rejection Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "negativeRisk",
          label: "Negative Risk",
          valueType: { type: "number" },
        },
        {
          id: "positiveRisk",
          label: "Positive Risk",
          valueType: { type: "number" },
        },
        {
          id: "rejectRisk",
          label: "Reject Risk",
          valueType: { type: "number" },
        },
        {
          id: "tiedActions",
          label: "Tied Actions",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = binaryRejectionCostIndifferenceTool.execute;
export default binaryRejectionCostIndifferenceTool;
