import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskId: string;
  readonly signoffRecordId: string;
  readonly recordedStatus: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskId: { type: "string", maxLength: 8192, minLength: 1 },
    signoffRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedStatus: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["taskId", "signoffRecordId", "recordedStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit sanitation sign-off metadata without specifying or validating a sanitation procedure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskId, signoffRecordId, recordedStatus } = request;
  const compute = (): Output => {
    H.domain(taskId.length > 0, "taskId");
    H.domain(signoffRecordId.length > 0, "signoffRecordId");
    H.domain(recordedStatus.length > 0, "recordedStatus");
    return { token: JSON.stringify([taskId, signoffRecordId, recordedStatus]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    taskId: "TASK17",
    signoffRecordId: "SIG2",
    recordedStatus: "recorded",
  },
  output: { token: '["TASK17","SIG2","recorded"]' },
} satisfies ToolExample<Input, Output>;
export const sanitationTaskSignOffLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["food-safety", "food safety", "research and quality management"],
      keywords: ["food safety", "research and quality management"],
    },
    id: "food-safety/sanitation-task-sign-off-label",
    title: "Sanitation Task Sign Off Label",
    description:
      "Preserve explicit sanitation sign-off metadata without specifying or validating a sanitation procedure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskId: { type: "string", maxLength: 8192, minLength: 1 },
        signoffRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedStatus: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["taskId", "signoffRecordId", "recordedStatus"],
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
          id: "signoffRecordId",
          label: "Signoff Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedStatus",
          label: "Recorded Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sanitationTaskSignOffLabelTool.execute;
export default sanitationTaskSignOffLabelTool;
