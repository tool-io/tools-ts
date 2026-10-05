import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bufferHours: number;
  readonly taskHours: number;
};
export type Output = {
  readonly bufferShareOfCombined: number;
  readonly bufferToTaskRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bufferHours: { type: "number", minimum: 0 },
    taskHours: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["bufferHours", "taskHours"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bufferShareOfCombined: { type: "number" },
    bufferToTaskRatio: { type: "number" },
  },
  required: ["bufferShareOfCombined", "bufferToTaskRatio"],
} as const;
/** Distinguish a project buffer's share of combined scheduled time from its ratio to task time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bufferHours, taskHours } = request;
  const compute = (): Output => {
    H.domain(bufferHours >= 0, "bufferHours");
    (H.domain(taskHours > 0, "taskHours"), taskHours);
    return {
      bufferShareOfCombined: bufferHours / (bufferHours + taskHours),
      bufferToTaskRatio: bufferHours / taskHours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bufferHours: 4, taskHours: 16 },
  output: { bufferShareOfCombined: 0.2, bufferToTaskRatio: 0.25 },
} satisfies ToolExample<Input, Output>;
export const projectBufferTaskShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/project-buffer-task-share",
    title: "Project Buffer Task Share Tool",
    description:
      "Distinguish a project buffer's share of combined scheduled time from its ratio to task time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bufferHours: { type: "number", minimum: 0 },
        taskHours: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["bufferHours", "taskHours"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bufferShareOfCombined: { type: "number" },
        bufferToTaskRatio: { type: "number" },
      },
      required: ["bufferShareOfCombined", "bufferToTaskRatio"],
    },
    ports: {
      inputs: [
        {
          id: "bufferHours",
          label: "Buffer Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taskHours",
          label: "Task Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "bufferShareOfCombined",
          label: "Buffer Share Of Combined",
          valueType: { type: "number" },
        },
        {
          id: "bufferToTaskRatio",
          label: "Buffer To Task Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = projectBufferTaskShareTool.execute;
export default projectBufferTaskShareTool;
