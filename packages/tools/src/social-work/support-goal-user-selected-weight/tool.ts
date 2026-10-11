import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly goalId: string;
  readonly suppliedWeight: number;
  readonly sumOfWeights: number;
};
export type Output = {
  readonly normalizedWeight: number;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    goalId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedWeight: { type: "number", minimum: 0 },
    sumOfWeights: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["goalId", "suppliedWeight", "sumOfWeights"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedWeight: { type: "number" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["normalizedWeight", "label"],
} as const;
/** Normalize an explicitly user-selected support-goal weight without selecting goals or clinical priorities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { goalId, suppliedWeight, sumOfWeights } = request;
  const compute = (): Output => {
    H.domain(goalId.length > 0, "goalId");
    (H.domain(
      Number.isFinite(sumOfWeights) && sumOfWeights > 0,
      "sumOfWeights",
    ),
      sumOfWeights);
    H.domain(
      suppliedWeight >= 0 && suppliedWeight <= sumOfWeights,
      "suppliedWeight",
    );
    return {
      normalizedWeight: suppliedWeight / sumOfWeights,
      label: goalId + "; weight=" + suppliedWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { goalId: "G17", suppliedWeight: 3, sumOfWeights: 12 },
  output: { normalizedWeight: 0.25, label: "G17; weight=3" },
} satisfies ToolExample<Input, Output>;
export const supportGoalUserSelectedWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["social-work", "social work", "social sciences"],
      keywords: ["social work", "social sciences"],
    },
    id: "social-work/support-goal-user-selected-weight",
    title: "Support Goal User Selected Weight",
    description:
      "Normalize an explicitly user-selected support-goal weight without selecting goals or clinical priorities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        goalId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedWeight: { type: "number", minimum: 0 },
        sumOfWeights: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["goalId", "suppliedWeight", "sumOfWeights"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedWeight: { type: "number" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["normalizedWeight", "label"],
    },
    ports: {
      inputs: [
        {
          id: "goalId",
          label: "Goal Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedWeight",
          label: "Supplied Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sumOfWeights",
          label: "Sum Of Weights",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "normalizedWeight",
          label: "Normalized Weight",
          valueType: { type: "number" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = supportGoalUserSelectedWeightTool.execute;
export default supportGoalUserSelectedWeightTool;
