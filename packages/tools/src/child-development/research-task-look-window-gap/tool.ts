import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lookStart: number;
  readonly lookEnd: number;
  readonly taskStart: number;
  readonly taskEnd: number;
  readonly requiredLookDuration: number;
};
export type Output = {
  readonly overlapDuration: number;
  readonly durationGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lookStart: { type: "number" },
    lookEnd: { type: "number" },
    taskStart: { type: "number" },
    taskEnd: { type: "number" },
    requiredLookDuration: { type: "number", minimum: 0 },
  },
  required: [
    "lookStart",
    "lookEnd",
    "taskStart",
    "taskEnd",
    "requiredLookDuration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlapDuration: { type: "number" },
    durationGap: { type: "number" },
  },
  required: ["overlapDuration", "durationGap"],
} as const;
/** Compare explicit research look intervals with a supplied duration requirement, without developmental interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lookStart, lookEnd, taskStart, taskEnd, requiredLookDuration } =
    request;
  const compute = (): Output => {
    H.domain(
      lookEnd >= lookStart && taskEnd >= taskStart && requiredLookDuration >= 0,
    );
    return (() => {
      const overlapDuration = Math.max(
        0,
        Math.min(lookEnd, taskEnd) - Math.max(lookStart, taskStart),
      );
      return {
        overlapDuration,
        durationGap: overlapDuration - requiredLookDuration,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    lookStart: 1,
    lookEnd: 5,
    taskStart: 0,
    taskEnd: 4,
    requiredLookDuration: 2,
  },
  output: { overlapDuration: 3, durationGap: 1 },
} satisfies ToolExample<Input, Output>;
export const researchTaskLookWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "child-development/research-task-look-window-gap",
    title: "Research Task Look Window Gap Tool",
    description:
      "Compare explicit research look intervals with a supplied duration requirement, without developmental interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lookStart: { type: "number" },
        lookEnd: { type: "number" },
        taskStart: { type: "number" },
        taskEnd: { type: "number" },
        requiredLookDuration: { type: "number", minimum: 0 },
      },
      required: [
        "lookStart",
        "lookEnd",
        "taskStart",
        "taskEnd",
        "requiredLookDuration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlapDuration: { type: "number" },
        durationGap: { type: "number" },
      },
      required: ["overlapDuration", "durationGap"],
    },
    ports: {
      inputs: [
        {
          id: "lookStart",
          label: "Look Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lookEnd",
          label: "Look End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taskStart",
          label: "Task Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taskEnd",
          label: "Task End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "requiredLookDuration",
          label: "Required Look Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "overlapDuration",
          label: "Overlap Duration",
          valueType: { type: "number" },
        },
        {
          id: "durationGap",
          label: "Duration Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchTaskLookWindowGapTool.execute;
export default researchTaskLookWindowGapTool;
