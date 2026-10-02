import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly taskTime: number; readonly restTime: number };
export type Output = { readonly ratio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskTime: { type: "number", minimum: 0 },
    restTime: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["taskTime", "restTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratio: { type: "number" } },
  required: ["ratio"],
} as const;
/** Calculate task rest time ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskTime, restTime } = request;
  const compute = (): Output => {
    H.domain(taskTime >= 0);
    H.positive(restTime);
    return { ratio: taskTime / restTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taskTime: 6, restTime: 3 },
  output: { ratio: 2 },
} satisfies ToolExample<Input, Output>;
export const taskRestTimeRatioTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "physiotherapy/task-rest-time-ratio",
    title: "Task Rest Time Ratio Tool",
    description:
      "Calculate task rest time ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskTime: { type: "number", minimum: 0 },
        restTime: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["taskTime", "restTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratio: { type: "number" } },
      required: ["ratio"],
    },
    ports: {
      inputs: [
        {
          id: "taskTime",
          label: "Task Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "restTime",
          label: "Rest Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "ratio", label: "Ratio", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = taskRestTimeRatioTool.execute;
export default taskRestTimeRatioTool;
