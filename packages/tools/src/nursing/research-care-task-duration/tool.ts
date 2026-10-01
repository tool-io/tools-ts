import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskStart: number;
  readonly taskEnd: number;
  readonly suppliedPause: number;
};
export type Output = {
  readonly elapsed: number;
  readonly activeDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskStart: { type: "number" },
    taskEnd: { type: "number" },
    suppliedPause: { type: "number", minimum: 0 },
  },
  required: ["taskStart", "taskEnd", "suppliedPause"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number" },
    activeDuration: { type: "number" },
  },
  required: ["elapsed", "activeDuration"],
} as const;
/** Supplied research task-time accounting without recommended staffing or care durations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskStart, taskEnd, suppliedPause } = request;
  const compute = (): Output => {
    H.domain(
      taskEnd >= taskStart &&
        suppliedPause >= 0 &&
        suppliedPause <= taskEnd - taskStart,
    );
    return {
      elapsed: taskEnd - taskStart,
      activeDuration: taskEnd - taskStart - suppliedPause,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taskStart: 10, taskEnd: 50, suppliedPause: 5 },
  output: { elapsed: 40, activeDuration: 35 },
} satisfies ToolExample<Input, Output>;
export const researchCareTaskDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nursing/research-care-task-duration",
    title: "Research Care Task Duration Tool",
    description:
      "Supplied research task-time accounting without recommended staffing or care durations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskStart: { type: "number" },
        taskEnd: { type: "number" },
        suppliedPause: { type: "number", minimum: 0 },
      },
      required: ["taskStart", "taskEnd", "suppliedPause"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number" },
        activeDuration: { type: "number" },
      },
      required: ["elapsed", "activeDuration"],
    },
    ports: {
      inputs: [
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
          id: "suppliedPause",
          label: "Supplied Pause",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        {
          id: "activeDuration",
          label: "Active Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchCareTaskDurationTool.execute;
export default researchCareTaskDurationTool;
