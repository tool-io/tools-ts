import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reward: number;
  readonly penalty: number;
  readonly correct: boolean;
  readonly reference: number;
};
export type Output = {
  readonly realized: number;
  readonly referenceDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reward: { type: "number", minimum: 0 },
    penalty: { type: "number", minimum: 0 },
    correct: { type: "boolean" },
    reference: { type: "number" },
  },
  required: ["reward", "penalty", "correct", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    realized: { type: "number" },
    referenceDifference: { type: "number" },
  },
  required: ["realized", "referenceDifference"],
} as const;
/** Calculate trial reward loss reference balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reward, penalty, correct, reference } = request;
  const compute = (): Output => {
    H.domain(reward >= 0 && penalty >= 0);
    return {
      realized: correct ? reward : -penalty,
      referenceDifference: (correct ? reward : -penalty) - reference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reward: 10, penalty: 4, correct: true, reference: 3 },
  output: { realized: 10, referenceDifference: 7 },
} satisfies ToolExample<Input, Output>;
export const trialRewardLossReferenceBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/trial-reward-loss-reference-balance",
    title: "Trial Reward Loss Reference Balance Tool",
    description:
      "Calculate trial reward loss reference balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reward: { type: "number", minimum: 0 },
        penalty: { type: "number", minimum: 0 },
        correct: { type: "boolean" },
        reference: { type: "number" },
      },
      required: ["reward", "penalty", "correct", "reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        realized: { type: "number" },
        referenceDifference: { type: "number" },
      },
      required: ["realized", "referenceDifference"],
    },
    ports: {
      inputs: [
        {
          id: "reward",
          label: "Reward",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "penalty",
          label: "Penalty",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "correct",
          label: "Correct",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "realized", label: "Realized", valueType: { type: "number" } },
        {
          id: "referenceDifference",
          label: "Reference Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialRewardLossReferenceBalanceTool.execute;
export default trialRewardLossReferenceBalanceTool;
