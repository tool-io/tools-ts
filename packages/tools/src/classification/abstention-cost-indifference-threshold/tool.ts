import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wrongClassificationCost: number;
  readonly abstentionCost: number;
  readonly correctClassificationCost: number;
};
export type Output = {
  readonly correctProbabilityThreshold: number;
  readonly withinUnitInterval: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wrongClassificationCost: { type: "number" },
    abstentionCost: { type: "number" },
    correctClassificationCost: { type: "number" },
  },
  required: [
    "wrongClassificationCost",
    "abstentionCost",
    "correctClassificationCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctProbabilityThreshold: { type: "number" },
    withinUnitInterval: { type: "boolean" },
  },
  required: ["correctProbabilityThreshold", "withinUnitInterval"],
} as const;
/** Solve the supplied expected-cost equality p*Ccorrect+(1−p)*Cwrong=Cabstain without selecting a decision policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wrongClassificationCost, abstentionCost, correctClassificationCost } =
    request;
  const compute = (): Output => {
    H.domain(wrongClassificationCost !== correctClassificationCost);
    return {
      correctProbabilityThreshold:
        (wrongClassificationCost - abstentionCost) /
        (wrongClassificationCost - correctClassificationCost),
      withinUnitInterval:
        (wrongClassificationCost - abstentionCost) /
          (wrongClassificationCost - correctClassificationCost) >=
          0 &&
        (wrongClassificationCost - abstentionCost) /
          (wrongClassificationCost - correctClassificationCost) <=
          1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    wrongClassificationCost: 10,
    abstentionCost: 2,
    correctClassificationCost: 0,
  },
  output: { correctProbabilityThreshold: 0.8, withinUnitInterval: true },
} satisfies ToolExample<Input, Output>;
export const abstentionCostIndifferenceThresholdTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "classification/abstention-cost-indifference-threshold",
      title: "Abstention Cost Indifference Threshold Tool",
      description:
        "Solve the supplied expected-cost equality p*Ccorrect+(1−p)*Cwrong=Cabstain without selecting a decision policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wrongClassificationCost: { type: "number" },
          abstentionCost: { type: "number" },
          correctClassificationCost: { type: "number" },
        },
        required: [
          "wrongClassificationCost",
          "abstentionCost",
          "correctClassificationCost",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correctProbabilityThreshold: { type: "number" },
          withinUnitInterval: { type: "boolean" },
        },
        required: ["correctProbabilityThreshold", "withinUnitInterval"],
      },
      ports: {
        inputs: [
          {
            id: "wrongClassificationCost",
            label: "Wrong Classification Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "abstentionCost",
            label: "Abstention Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "correctClassificationCost",
            label: "Correct Classification Cost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "correctProbabilityThreshold",
            label: "Correct Probability Threshold",
            valueType: { type: "number" },
          },
          {
            id: "withinUnitInterval",
            label: "Within Unit Interval",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = abstentionCostIndifferenceThresholdTool.execute;
export default abstentionCostIndifferenceThresholdTool;
