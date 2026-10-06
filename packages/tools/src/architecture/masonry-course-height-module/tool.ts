import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly unitHeight: number;
  readonly bedJointThickness: number;
  readonly courseCount: number;
};
export type Output = {
  readonly courseModule: number;
  readonly stackedHeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unitHeight: { type: "number", minimum: 0 },
    bedJointThickness: { type: "number", minimum: 0 },
    courseCount: { type: "integer", minimum: 0 },
  },
  required: ["unitHeight", "bedJointThickness", "courseCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    courseModule: { type: "number" },
    stackedHeight: { type: "number" },
  },
  required: ["courseModule", "stackedHeight"],
} as const;
/** Calculate an explicit masonry course module and stack height with joints only between units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { unitHeight, bedJointThickness, courseCount } = request;
  const compute = (): Output => {
    H.domain(unitHeight >= 0 && bedJointThickness >= 0, "unitHeight");
    (H.domain(
      Number.isSafeInteger(courseCount) &&
        courseCount >= 0 &&
        courseCount <= Number.MAX_SAFE_INTEGER,
      "courseCount",
    ),
      courseCount);
    return {
      courseModule: unitHeight + bedJointThickness,
      stackedHeight:
        unitHeight * courseCount +
        bedJointThickness * Math.max(0, courseCount - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { unitHeight: 65, bedJointThickness: 10, courseCount: 10 },
  output: { courseModule: 75, stackedHeight: 740 },
} satisfies ToolExample<Input, Output>;
export const masonryCourseHeightModuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["architecture", "arts and design"],
      keywords: ["architecture", "arts and design"],
    },
    id: "architecture/masonry-course-height-module",
    title: "Masonry Course Height Module",
    description:
      "Calculate an explicit masonry course module and stack height with joints only between units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unitHeight: { type: "number", minimum: 0 },
        bedJointThickness: { type: "number", minimum: 0 },
        courseCount: { type: "integer", minimum: 0 },
      },
      required: ["unitHeight", "bedJointThickness", "courseCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        courseModule: { type: "number" },
        stackedHeight: { type: "number" },
      },
      required: ["courseModule", "stackedHeight"],
    },
    ports: {
      inputs: [
        {
          id: "unitHeight",
          label: "Unit Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bedJointThickness",
          label: "Bed Joint Thickness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "courseCount",
          label: "Course Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "courseModule",
          label: "Course Module",
          valueType: { type: "number" },
        },
        {
          id: "stackedHeight",
          label: "Stacked Height",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = masonryCourseHeightModuleTool.execute;
export default masonryCourseHeightModuleTool;
