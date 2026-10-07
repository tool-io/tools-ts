import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalPredictions: number;
  readonly abstentions: number;
};
export type Output = {
  readonly acceptedPredictions: number;
  readonly coverageFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalPredictions: { type: "integer", minimum: 0 },
    abstentions: { type: "integer", minimum: 0 },
  },
  required: ["totalPredictions", "abstentions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acceptedPredictions: { type: "integer" },
    coverageFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["acceptedPredictions", "coverageFraction", "defined"],
} as const;
/** Subtract explicit abstentions from prediction counts and report coverage, using a flagged zero sentinel for an empty total. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalPredictions, abstentions } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalPredictions) &&
        totalPredictions >= 0 &&
        totalPredictions <= Number.MAX_SAFE_INTEGER,
      "totalPredictions",
    ),
      totalPredictions);
    (H.domain(
      Number.isSafeInteger(abstentions) &&
        abstentions >= 0 &&
        abstentions <= totalPredictions,
      "abstentions",
    ),
      abstentions);
    return {
      acceptedPredictions: totalPredictions - abstentions,
      coverageFraction:
        totalPredictions === 0
          ? 0
          : (totalPredictions - abstentions) / totalPredictions,
      defined: totalPredictions > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalPredictions: 100, abstentions: 20 },
  output: { acceptedPredictions: 80, coverageFraction: 0.8, defined: true },
} satisfies ToolExample<Input, Output>;
export const selectiveClassificationAcceptedCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["ai", "data"],
        fields: [
          "classification",
          "classification metrics",
          "computer science",
        ],
        keywords: ["classification metrics", "computer science"],
      },
      id: "classification/selective-classification-accepted-count",
      title: "Selective Classification Accepted Count",
      description:
        "Subtract explicit abstentions from prediction counts and report coverage, using a flagged zero sentinel for an empty total.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalPredictions: { type: "integer", minimum: 0 },
          abstentions: { type: "integer", minimum: 0 },
        },
        required: ["totalPredictions", "abstentions"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          acceptedPredictions: { type: "integer" },
          coverageFraction: { type: "number" },
          defined: { type: "boolean" },
        },
        required: ["acceptedPredictions", "coverageFraction", "defined"],
      },
      ports: {
        inputs: [
          {
            id: "totalPredictions",
            label: "Total Predictions",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "abstentions",
            label: "Abstentions",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "acceptedPredictions",
            label: "Accepted Predictions",
            valueType: { type: "integer" },
          },
          {
            id: "coverageFraction",
            label: "Coverage Fraction",
            valueType: { type: "number" },
          },
          { id: "defined", label: "Defined", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = selectiveClassificationAcceptedCountTool.execute;
export default selectiveClassificationAcceptedCountTool;
