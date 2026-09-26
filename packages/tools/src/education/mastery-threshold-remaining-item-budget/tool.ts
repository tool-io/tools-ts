import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly correct: number;
  readonly answered: number;
  readonly total: number;
  readonly masteryFraction: number;
};
export type Output = {
  readonly neededCorrect: number;
  readonly remaining: number;
  readonly reachable: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correct: { type: "integer", minimum: 0 },
    answered: { type: "integer", minimum: 0 },
    total: { type: "integer", minimum: 1 },
    masteryFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["correct", "answered", "total", "masteryFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    neededCorrect: { type: "integer" },
    remaining: { type: "integer" },
    reachable: { type: "boolean" },
  },
  required: ["neededCorrect", "remaining", "reachable"],
} as const;
/** Calculate mastery threshold remaining item budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { correct, answered, total, masteryFraction } = request;
  const compute = (): Output => {
    H.integer(total, 1);
    H.integer(answered, 0, total);
    H.integer(correct, 0, answered);
    H.probability(masteryFraction);
    return {
      neededCorrect: Math.max(0, Math.ceil(total * masteryFraction) - correct),
      remaining: total - answered,
      reachable:
        Math.ceil(total * masteryFraction) - correct <= total - answered,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { correct: 12, answered: 15, total: 20, masteryFraction: 0.8 },
  output: { neededCorrect: 4, remaining: 5, reachable: true },
} satisfies ToolExample<Input, Output>;
export const masteryThresholdRemainingItemBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "education/mastery-threshold-remaining-item-budget",
      title: "Mastery Threshold Remaining Item Budget Tool",
      description:
        "Calculate mastery threshold remaining item budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          correct: { type: "integer", minimum: 0 },
          answered: { type: "integer", minimum: 0 },
          total: { type: "integer", minimum: 1 },
          masteryFraction: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["correct", "answered", "total", "masteryFraction"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          neededCorrect: { type: "integer" },
          remaining: { type: "integer" },
          reachable: { type: "boolean" },
        },
        required: ["neededCorrect", "remaining", "reachable"],
      },
      ports: {
        inputs: [
          {
            id: "correct",
            label: "Correct",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "answered",
            label: "Answered",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "total",
            label: "Total",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "masteryFraction",
            label: "Mastery Fraction",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "neededCorrect",
            label: "Needed Correct",
            valueType: { type: "integer" },
          },
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "integer" },
          },
          {
            id: "reachable",
            label: "Reachable",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = masteryThresholdRemainingItemBudgetTool.execute;
export default masteryThresholdRemainingItemBudgetTool;
