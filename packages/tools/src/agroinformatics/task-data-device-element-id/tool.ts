import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskId: string;
  readonly deviceId: string;
  readonly elementId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskId: { type: "string", maxLength: 8192, minLength: 1 },
    deviceId: { type: "string", maxLength: 8192, minLength: 1 },
    elementId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["taskId", "deviceId", "elementId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit task-data device element without accessing hardware or parsing a task file. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskId, deviceId, elementId } = request;
  const compute = (): Output => {
    H.domain(taskId.length > 0, "taskId");
    H.domain(deviceId.length > 0, "deviceId");
    H.domain(elementId.length > 0, "elementId");
    return { token: JSON.stringify([taskId, deviceId, elementId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taskId: "TASK17", deviceId: "DEV2", elementId: "EL2" },
  output: { token: '["TASK17","DEV2","EL2"]' },
} satisfies ToolExample<Input, Output>;
export const taskDataDeviceElementIdTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroinformatics", "agriculture"],
      keywords: ["agroinformatics", "agriculture"],
    },
    id: "agroinformatics/task-data-device-element-id",
    title: "Task Data Device Element ID",
    description:
      "Qualify an explicit task-data device element without accessing hardware or parsing a task file.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskId: { type: "string", maxLength: 8192, minLength: 1 },
        deviceId: { type: "string", maxLength: 8192, minLength: 1 },
        elementId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["taskId", "deviceId", "elementId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
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
          id: "deviceId",
          label: "Device Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "elementId",
          label: "Element Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = taskDataDeviceElementIdTool.execute;
export default taskDataDeviceElementIdTool;
