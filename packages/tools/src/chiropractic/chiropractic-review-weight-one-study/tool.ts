import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly effect: number;
  readonly variance: number;
  readonly betweenVariance: number;
  readonly totalWeight: number;
};
export type Output = {
  readonly weight: number;
  readonly normalizedWeight: number;
  readonly contribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effect: { type: "number" },
    variance: { type: "number", exclusiveMinimum: 0 },
    betweenVariance: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["effect", "variance", "betweenVariance", "totalWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weight: { type: "number" },
    normalizedWeight: { type: "number" },
    contribution: { type: "number" },
  },
  required: ["weight", "normalizedWeight", "contribution"],
} as const;
/** One explicitly supplied inverse-variance research synthesis contribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { effect, variance, betweenVariance, totalWeight } = request;
  const compute = (): Output => {
    H.domain(variance > 0 && betweenVariance >= 0);
    H.positive(totalWeight);
    return {
      weight: 1 / (variance + betweenVariance),
      normalizedWeight: 1 / ((variance + betweenVariance) * totalWeight),
      contribution: effect / ((variance + betweenVariance) * totalWeight),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    effect: 0.4,
    variance: 0.04,
    betweenVariance: 0.01,
    totalWeight: 100,
  },
  output: { weight: 20, normalizedWeight: 0.2, contribution: 0.08 },
} satisfies ToolExample<Input, Output>;
export const chiropracticReviewWeightOneStudyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chiropractic/chiropractic-review-weight-one-study",
    title: "Chiropractic Review Weight One Study Tool",
    description:
      "One explicitly supplied inverse-variance research synthesis contribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effect: { type: "number" },
        variance: { type: "number", exclusiveMinimum: 0 },
        betweenVariance: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["effect", "variance", "betweenVariance", "totalWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weight: { type: "number" },
        normalizedWeight: { type: "number" },
        contribution: { type: "number" },
      },
      required: ["weight", "normalizedWeight", "contribution"],
    },
    ports: {
      inputs: [
        {
          id: "effect",
          label: "Effect",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "variance",
          label: "Variance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "betweenVariance",
          label: "Between Variance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "weight", label: "Weight", valueType: { type: "number" } },
        {
          id: "normalizedWeight",
          label: "Normalized Weight",
          valueType: { type: "number" },
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
export const run = chiropracticReviewWeightOneStudyTool.execute;
export default chiropracticReviewWeightOneStudyTool;
