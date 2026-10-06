import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly selfRating: number;
  readonly practiceRating: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    selfRating: { type: "number" },
    practiceRating: { type: "number" },
  },
  required: ["selfRating", "practiceRating"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate a supplied practice-rating minus self-rating gap on an explicitly shared learning-goal scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { selfRating, practiceRating } = request;
  const compute = (): Output => {
    return { signedGap: practiceRating - selfRating };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { selfRating: 12, practiceRating: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const learningGoalSelfRatingPracticeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["andragogy", "education"],
      keywords: ["andragogy", "education"],
    },
    id: "andragogy/learning-goal-self-rating-practice-gap",
    title: "Learning Goal Self Rating Practice Gap",
    description:
      "Calculate a supplied practice-rating minus self-rating gap on an explicitly shared learning-goal scale.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        selfRating: { type: "number" },
        practiceRating: { type: "number" },
      },
      required: ["selfRating", "practiceRating"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "selfRating",
          label: "Self Rating",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "practiceRating",
          label: "Practice Rating",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = learningGoalSelfRatingPracticeGapTool.execute;
export default learningGoalSelfRatingPracticeGapTool;
