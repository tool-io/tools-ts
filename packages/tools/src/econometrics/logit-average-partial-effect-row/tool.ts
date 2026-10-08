import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coefficient: number;
  readonly predictedProbability: number;
  readonly averagingCount: number;
};
export type Output = {
  readonly rowPartialEffect: number;
  readonly averageContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coefficient: { type: "number" },
    predictedProbability: { type: "number", minimum: 0, maximum: 1 },
    averagingCount: { type: "integer", minimum: 1 },
  },
  required: ["coefficient", "predictedProbability", "averagingCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowPartialEffect: { type: "number" },
    averageContribution: { type: "number" },
  },
  required: ["rowPartialEffect", "averageContribution"],
} as const;
/** Calculate one continuous-regressor logit partial effect and its contribution to an explicit equally weighted sample average. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coefficient, predictedProbability, averagingCount } = request;
  const compute = (): Output => {
    (H.domain(
      predictedProbability >= 0 && predictedProbability <= 1,
      "predictedProbability",
    ),
      predictedProbability);
    (H.domain(
      Number.isSafeInteger(averagingCount) &&
        averagingCount >= 1 &&
        averagingCount <= Number.MAX_SAFE_INTEGER,
      "averagingCount",
    ),
      averagingCount);
    return {
      rowPartialEffect:
        coefficient * predictedProbability * (1 - predictedProbability),
      averageContribution:
        (coefficient * predictedProbability * (1 - predictedProbability)) /
        averagingCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coefficient: 2, predictedProbability: 0.5, averagingCount: 100 },
  output: { rowPartialEffect: 0.5, averageContribution: 0.005 },
} satisfies ToolExample<Input, Output>;
export const logitAveragePartialEffectRowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/logit-average-partial-effect-row",
    title: "Logit Average Partial Effect Row Tool",
    description:
      "Calculate one continuous-regressor logit partial effect and its contribution to an explicit equally weighted sample average.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coefficient: { type: "number" },
        predictedProbability: { type: "number", minimum: 0, maximum: 1 },
        averagingCount: { type: "integer", minimum: 1 },
      },
      required: ["coefficient", "predictedProbability", "averagingCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowPartialEffect: { type: "number" },
        averageContribution: { type: "number" },
      },
      required: ["rowPartialEffect", "averageContribution"],
    },
    ports: {
      inputs: [
        {
          id: "coefficient",
          label: "Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "predictedProbability",
          label: "Predicted Probability",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "averagingCount",
          label: "Averaging Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "rowPartialEffect",
          label: "Row Partial Effect",
          valueType: { type: "number" },
        },
        {
          id: "averageContribution",
          label: "Average Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = logitAveragePartialEffectRowTool.execute;
export default logitAveragePartialEffectRowTool;
