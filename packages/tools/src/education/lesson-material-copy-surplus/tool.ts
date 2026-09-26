import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly copies: number;
  readonly learners: number;
  readonly copiesPerLearner: number;
  readonly sharedSets: number;
};
export type Output = { readonly required: number; readonly surplus: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    copies: { type: "integer", minimum: 0 },
    learners: { type: "integer", minimum: 0 },
    copiesPerLearner: { type: "integer", minimum: 0 },
    sharedSets: { type: "integer", minimum: 0 },
  },
  required: ["copies", "learners", "copiesPerLearner", "sharedSets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { required: { type: "integer" }, surplus: { type: "integer" } },
  required: ["required", "surplus"],
} as const;
/** Subtract explicitly supplied reusable copy-equivalents from individual copy demand. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { copies, learners, copiesPerLearner, sharedSets } = request;
  const compute = (): Output => {
    H.integer(copies, 0);
    H.integer(learners, 0);
    H.integer(copiesPerLearner, 0);
    H.integer(sharedSets, 0);
    return {
      required: Math.max(0, learners * copiesPerLearner - sharedSets),
      surplus: copies - Math.max(0, learners * copiesPerLearner - sharedSets),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { copies: 40, learners: 30, copiesPerLearner: 1, sharedSets: 5 },
  output: { required: 25, surplus: 15 },
} satisfies ToolExample<Input, Output>;
export const lessonMaterialCopySurplusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/lesson-material-copy-surplus",
    title: "Lesson Material Copy Surplus Tool",
    description:
      "Subtract explicitly supplied reusable copy-equivalents from individual copy demand.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        copies: { type: "integer", minimum: 0 },
        learners: { type: "integer", minimum: 0 },
        copiesPerLearner: { type: "integer", minimum: 0 },
        sharedSets: { type: "integer", minimum: 0 },
      },
      required: ["copies", "learners", "copiesPerLearner", "sharedSets"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: { type: "integer" },
        surplus: { type: "integer" },
      },
      required: ["required", "surplus"],
    },
    ports: {
      inputs: [
        {
          id: "copies",
          label: "Copies",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "learners",
          label: "Learners",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "copiesPerLearner",
          label: "Copies Per Learner",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sharedSets",
          label: "Shared Sets",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "required", label: "Required", valueType: { type: "integer" } },
        { id: "surplus", label: "Surplus", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = lessonMaterialCopySurplusTool.execute;
export default lessonMaterialCopySurplusTool;
