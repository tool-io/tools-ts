import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskId: string;
  readonly completed: boolean;
  readonly cancelled: boolean;
  readonly handedOver: boolean;
};
export type Output = {
  readonly pending: boolean;
  readonly pendingWithoutHandoff: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskId: { type: "string", maxLength: 8192, minLength: 1 },
    completed: { type: "boolean" },
    cancelled: { type: "boolean" },
    handedOver: { type: "boolean" },
  },
  required: ["taskId", "completed", "cancelled", "handedOver"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pending: { type: "boolean" },
    pendingWithoutHandoff: { type: "boolean" },
  },
  required: ["pending", "pendingWithoutHandoff"],
} as const;
/** Identify unresolved care-transition tasks from explicit completion, cancellation, and handoff flags. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskId, completed, cancelled, handedOver } = request;
  const compute = (): Output => {
    H.domain(taskId.length > 0, "taskId");
    H.domain(!(completed && cancelled), "completed");
    return {
      pending: !completed && !cancelled,
      pendingWithoutHandoff: !completed && !cancelled && !handedOver,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    taskId: "T17",
    completed: false,
    cancelled: false,
    handedOver: false,
  },
  output: { pending: true, pendingWithoutHandoff: true },
} satisfies ToolExample<Input, Output>;
export const careTransitionPendingtaskFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["geriatrics", "health and medicine"],
      keywords: ["geriatrics", "health and medicine"],
    },
    id: "geriatrics/care-transition-pending-task-flag",
    title: "Care Transition Pending Task Flag",
    description:
      "Identify unresolved care-transition tasks from explicit completion, cancellation, and handoff flags.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskId: { type: "string", maxLength: 8192, minLength: 1 },
        completed: { type: "boolean" },
        cancelled: { type: "boolean" },
        handedOver: { type: "boolean" },
      },
      required: ["taskId", "completed", "cancelled", "handedOver"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pending: { type: "boolean" },
        pendingWithoutHandoff: { type: "boolean" },
      },
      required: ["pending", "pendingWithoutHandoff"],
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
          id: "completed",
          label: "Completed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "cancelled",
          label: "Cancelled",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "handedOver",
          label: "Handed Over",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "pending", label: "Pending", valueType: { type: "boolean" } },
        {
          id: "pendingWithoutHandoff",
          label: "Pending Without Handoff",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = careTransitionPendingtaskFlagTool.execute;
export default careTransitionPendingtaskFlagTool;
