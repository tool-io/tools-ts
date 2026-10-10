import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskId: string;
  readonly exposureCode: string;
  readonly codebookSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskId: { type: "string", maxLength: 8192, minLength: 1 },
    exposureCode: { type: "string", maxLength: 8192, minLength: 1 },
    codebookSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["taskId", "exposureCode", "codebookSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicitly assigned task exposure code without estimating exposure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskId, exposureCode, codebookSource } = request;
  const compute = (): Output => {
    H.domain(taskId.length > 0, "taskId");
    H.domain(exposureCode.length > 0, "exposureCode");
    H.domain(codebookSource.length > 0, "codebookSource");
    return { token: JSON.stringify([taskId, exposureCode, codebookSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    taskId: "T17",
    exposureCode: "EXP-A",
    codebookSource: "Codebook v2",
  },
  output: { token: '["T17","EXP-A","Codebook v2"]' },
} satisfies ToolExample<Input, Output>;
export const occupationalTaskExposureCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-health",
        "occupational health",
        "health and medicine",
      ],
      keywords: ["occupational health", "health and medicine"],
    },
    id: "occupational-health/occupational-task-exposure-code",
    title: "Occupational Task Exposure Code",
    description:
      "Qualify an explicitly assigned task exposure code without estimating exposure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskId: { type: "string", maxLength: 8192, minLength: 1 },
        exposureCode: { type: "string", maxLength: 8192, minLength: 1 },
        codebookSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["taskId", "exposureCode", "codebookSource"],
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
          id: "exposureCode",
          label: "Exposure Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codebookSource",
          label: "Codebook Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = occupationalTaskExposureCodeTool.execute;
export default occupationalTaskExposureCodeTool;
