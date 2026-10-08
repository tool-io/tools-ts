import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly goalId: string;
  readonly ratingText: string;
  readonly raterSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    goalId: { type: "string", maxLength: 8192, minLength: 1 },
    ratingText: { type: "string", maxLength: 8192, minLength: 1 },
    raterSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["goalId", "ratingText", "raterSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied learning-goal rating and explicit rater source without reconciling perspectives. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { goalId, ratingText, raterSource } = request;
  const compute = (): Output => {
    H.domain(goalId.length > 0, "goalId");
    H.domain(ratingText.length > 0, "ratingText");
    H.domain(raterSource.length > 0, "raterSource");
    return { token: JSON.stringify([goalId, ratingText, raterSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { goalId: "G17", ratingText: "4", raterSource: "self" },
  output: { token: '["G17","4","self"]' },
} satisfies ToolExample<Input, Output>;
export const learningGoalSelfOtherSourceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/learning-goal-self-other-source-tag",
    title: "Learning Goal Self Other Source Tag Tool",
    description:
      "Preserve a supplied learning-goal rating and explicit rater source without reconciling perspectives.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        goalId: { type: "string", maxLength: 8192, minLength: 1 },
        ratingText: { type: "string", maxLength: 8192, minLength: 1 },
        raterSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["goalId", "ratingText", "raterSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
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
          id: "ratingText",
          label: "Rating Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "raterSource",
          label: "Rater Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = learningGoalSelfOtherSourceTagTool.execute;
export default learningGoalSelfOtherSourceTagTool;
