import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentRating: number;
  readonly teacherRating: number;
  readonly scaleMinimum: number;
  readonly scaleMaximum: number;
};
export type Output = {
  readonly parentMinusTeacher: number;
  readonly equalRatings: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentRating: { type: "number" },
    teacherRating: { type: "number" },
    scaleMinimum: { type: "number" },
    scaleMaximum: { type: "number" },
  },
  required: ["parentRating", "teacherRating", "scaleMinimum", "scaleMaximum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentMinusTeacher: { type: "number" },
    equalRatings: { type: "boolean" },
  },
  required: ["parentMinusTeacher", "equalRatings"],
} as const;
/** Compare explicitly supplied parent and teacher ratings on a shared scale without diagnosing a child or adjudicating either report. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentRating, teacherRating, scaleMinimum, scaleMaximum } = request;
  const compute = (): Output => {
    H.domain(
      scaleMinimum < scaleMaximum &&
        parentRating >= scaleMinimum &&
        parentRating <= scaleMaximum &&
        teacherRating >= scaleMinimum &&
        teacherRating <= scaleMaximum,
      "scaleMinimum",
    );
    return {
      parentMinusTeacher: parentRating - teacherRating,
      equalRatings: parentRating === teacherRating,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    parentRating: 4,
    teacherRating: 2,
    scaleMinimum: 1,
    scaleMaximum: 5,
  },
  output: { parentMinusTeacher: 2, equalRatings: false },
} satisfies ToolExample<Input, Output>;
export const parentTeacherRatingDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "developmental-psychology",
        "developmental psychology",
        "psychology",
      ],
      keywords: ["developmental psychology", "psychology"],
    },
    id: "developmental-psychology/parent-teacher-rating-difference",
    title: "Parent Teacher Rating Difference",
    description:
      "Compare explicitly supplied parent and teacher ratings on a shared scale without diagnosing a child or adjudicating either report.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentRating: { type: "number" },
        teacherRating: { type: "number" },
        scaleMinimum: { type: "number" },
        scaleMaximum: { type: "number" },
      },
      required: [
        "parentRating",
        "teacherRating",
        "scaleMinimum",
        "scaleMaximum",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentMinusTeacher: { type: "number" },
        equalRatings: { type: "boolean" },
      },
      required: ["parentMinusTeacher", "equalRatings"],
    },
    ports: {
      inputs: [
        {
          id: "parentRating",
          label: "Parent Rating",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "teacherRating",
          label: "Teacher Rating",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleMinimum",
          label: "Scale Minimum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "scaleMaximum",
          label: "Scale Maximum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "parentMinusTeacher",
          label: "Parent Minus Teacher",
          valueType: { type: "number" },
        },
        {
          id: "equalRatings",
          label: "Equal Ratings",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = parentTeacherRatingDifferenceTool.execute;
export default parentTeacherRatingDifferenceTool;
