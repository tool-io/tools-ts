import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly learnerChoices: number;
  readonly sharedChoices: number;
  readonly instructorChoices: number;
  readonly sharedCredit: number;
};
export type Output = {
  readonly totalChoices: number;
  readonly weightedLearnerShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    learnerChoices: { type: "integer", minimum: 0 },
    sharedChoices: { type: "integer", minimum: 0 },
    instructorChoices: { type: "integer", minimum: 0 },
    sharedCredit: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "learnerChoices",
    "sharedChoices",
    "instructorChoices",
    "sharedCredit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalChoices: { type: "integer" },
    weightedLearnerShare: { type: "number" },
  },
  required: ["totalChoices", "weightedLearnerShare"],
} as const;
/** Calculate learner control decision share term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { learnerChoices, sharedChoices, instructorChoices, sharedCredit } =
    request;
  const compute = (): Output => {
    H.integer(learnerChoices, 0);
    H.integer(sharedChoices, 0);
    H.integer(instructorChoices, 0);
    H.domain(learnerChoices + sharedChoices + instructorChoices > 0);
    H.probability(sharedCredit);
    return {
      totalChoices: learnerChoices + sharedChoices + instructorChoices,
      weightedLearnerShare:
        (learnerChoices + sharedCredit * sharedChoices) /
        (learnerChoices + sharedChoices + instructorChoices),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    learnerChoices: 4,
    sharedChoices: 2,
    instructorChoices: 4,
    sharedCredit: 0.5,
  },
  output: { totalChoices: 10, weightedLearnerShare: 0.5 },
} satisfies ToolExample<Input, Output>;
export const learnerControlDecisionShareTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "andragogy/learner-control-decision-share-term",
    title: "Learner Control Decision Share Term Tool",
    description:
      "Calculate learner control decision share term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        learnerChoices: { type: "integer", minimum: 0 },
        sharedChoices: { type: "integer", minimum: 0 },
        instructorChoices: { type: "integer", minimum: 0 },
        sharedCredit: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "learnerChoices",
        "sharedChoices",
        "instructorChoices",
        "sharedCredit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalChoices: { type: "integer" },
        weightedLearnerShare: { type: "number" },
      },
      required: ["totalChoices", "weightedLearnerShare"],
    },
    ports: {
      inputs: [
        {
          id: "learnerChoices",
          label: "Learner Choices",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sharedChoices",
          label: "Shared Choices",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "instructorChoices",
          label: "Instructor Choices",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sharedCredit",
          label: "Shared Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "totalChoices",
          label: "Total Choices",
          valueType: { type: "integer" },
        },
        {
          id: "weightedLearnerShare",
          label: "Weighted Learner Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = learnerControlDecisionShareTermTool.execute;
export default learnerControlDecisionShareTermTool;
