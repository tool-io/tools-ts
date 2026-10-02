import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly itemWeights: readonly number[];
  readonly answered: readonly boolean[];
};
export type Output = {
  readonly totalWeight: number;
  readonly answeredWeight: number;
  readonly answeredFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    itemWeights: { type: "array", maxItems: 256, items: { type: "number" } },
    answered: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["itemWeights", "answered"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalWeight: { type: "number" },
    answeredWeight: { type: "number" },
    answeredFraction: { type: "number" },
  },
  required: ["totalWeight", "answeredWeight", "answeredFraction"],
} as const;
/** Explicit research response-completeness weights only; no questionnaire scoring key or mental-health interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { itemWeights, answered } = request;
  const compute = (): Output => {
    H.domain(
      itemWeights.length === answered.length &&
        itemWeights.every((x) => x >= 0) &&
        itemWeights.reduce((a, b) => a + b, 0) > 0,
    );
    return {
      totalWeight: itemWeights.reduce((a, b) => a + b, 0),
      answeredWeight: itemWeights.reduce(
        (a, b, i) => a + (answered[i] ? b : 0),
        0,
      ),
      answeredFraction:
        itemWeights.reduce((a, b, i) => a + (answered[i] ? b : 0), 0) /
        itemWeights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { itemWeights: [1, 2, 1], answered: [true, false, true] },
  output: { totalWeight: 4, answeredWeight: 2, answeredFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const psychiatricSurveyAnsweredWeightFractionTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "psychiatry/psychiatric-survey-answered-weight-fraction",
      title: "Psychiatric Survey Answered Weight Fraction Tool",
      description:
        "Explicit research response-completeness weights only; no questionnaire scoring key or mental-health interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          itemWeights: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          answered: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["itemWeights", "answered"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalWeight: { type: "number" },
          answeredWeight: { type: "number" },
          answeredFraction: { type: "number" },
        },
        required: ["totalWeight", "answeredWeight", "answeredFraction"],
      },
      ports: {
        inputs: [
          {
            id: "itemWeights",
            label: "Item Weights",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "answered",
            label: "Answered",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "totalWeight",
            label: "Total Weight",
            valueType: { type: "number" },
          },
          {
            id: "answeredWeight",
            label: "Answered Weight",
            valueType: { type: "number" },
          },
          {
            id: "answeredFraction",
            label: "Answered Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = psychiatricSurveyAnsweredWeightFractionTool.execute;
export default psychiatricSurveyAnsweredWeightFractionTool;
