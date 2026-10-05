import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly taskId: string; readonly ownerId: string };
export type Output = { readonly vacant: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskId: { type: "string", maxLength: 8192 },
    ownerId: { type: "string", maxLength: 8192 },
  },
  required: ["taskId", "ownerId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { vacant: { type: "boolean" } },
  required: ["vacant"],
} as const;
/** Identify a task with an empty or whitespace-only recorded owner identifier; no owner is assigned. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskId, ownerId } = request;
  const compute = (): Output => {
    H.domain(taskId.length > 0, "taskId");
    return { vacant: ownerId.trim().length === 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taskId: "T17", ownerId: "" },
  output: { vacant: true },
} satisfies ToolExample<Input, Output>;
export const taskOwnerVacancyFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/task-owner-vacancy-flag",
    title: "Task Owner Vacancy Flag Tool",
    description:
      "Identify a task with an empty or whitespace-only recorded owner identifier; no owner is assigned.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskId: { type: "string", maxLength: 8192 },
        ownerId: { type: "string", maxLength: 8192 },
      },
      required: ["taskId", "ownerId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { vacant: { type: "boolean" } },
      required: ["vacant"],
    },
    ports: {
      inputs: [
        {
          id: "taskId",
          label: "Task Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ownerId",
          label: "Owner Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "vacant", label: "Vacant", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = taskOwnerVacancyFlagTool.execute;
export default taskOwnerVacancyFlagTool;
