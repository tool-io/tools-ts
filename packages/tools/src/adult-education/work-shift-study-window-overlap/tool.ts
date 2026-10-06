import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shiftStart: number;
  readonly shiftEnd: number;
  readonly studyStart: number;
  readonly studyEnd: number;
};
export type Output = {
  readonly conflictDuration: number;
  readonly studyFreeDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftStart: { type: "number" },
    shiftEnd: { type: "number" },
    studyStart: { type: "number" },
    studyEnd: { type: "number" },
  },
  required: ["shiftStart", "shiftEnd", "studyStart", "studyEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conflictDuration: { type: "number" },
    studyFreeDuration: { type: "number" },
  },
  required: ["conflictDuration", "studyFreeDuration"],
} as const;
/** Intersect one work shift and one planned study interval on a shared linear time axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shiftStart, shiftEnd, studyStart, studyEnd } = request;
  const compute = (): Output => {
    H.domain(shiftEnd >= shiftStart && studyEnd >= studyStart, "shiftEnd");
    return (() => {
      const conflictDuration = Math.max(
        0,
        Math.min(shiftEnd, studyEnd) - Math.max(shiftStart, studyStart),
      );
      return {
        conflictDuration,
        studyFreeDuration: studyEnd - studyStart - conflictDuration,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shiftStart: 9, shiftEnd: 17, studyStart: 16, studyEnd: 19 },
  output: { conflictDuration: 1, studyFreeDuration: 2 },
} satisfies ToolExample<Input, Output>;
export const workShiftStudyWindowOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/work-shift-study-window-overlap",
    title: "Work Shift Study Window Overlap",
    description:
      "Intersect one work shift and one planned study interval on a shared linear time axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftStart: { type: "number" },
        shiftEnd: { type: "number" },
        studyStart: { type: "number" },
        studyEnd: { type: "number" },
      },
      required: ["shiftStart", "shiftEnd", "studyStart", "studyEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conflictDuration: { type: "number" },
        studyFreeDuration: { type: "number" },
      },
      required: ["conflictDuration", "studyFreeDuration"],
    },
    ports: {
      inputs: [
        {
          id: "shiftStart",
          label: "Shift Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shiftEnd",
          label: "Shift End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "studyStart",
          label: "Study Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "studyEnd",
          label: "Study End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "conflictDuration",
          label: "Conflict Duration",
          valueType: { type: "number" },
        },
        {
          id: "studyFreeDuration",
          label: "Study Free Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = workShiftStudyWindowOverlapTool.execute;
export default workShiftStudyWindowOverlapTool;
