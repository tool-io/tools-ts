import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskId: string;
  readonly assistanceCode: string;
  readonly classificationSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskId: { type: "string", maxLength: 8192, minLength: 1 },
    assistanceCode: { type: "string", maxLength: 8192, minLength: 1 },
    classificationSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["taskId", "assistanceCode", "classificationSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a recorded assistance code by its source without scoring functional ability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskId, assistanceCode, classificationSource } = request;
  const compute = (): Output => {
    H.domain(taskId.length > 0, "taskId");
    H.domain(assistanceCode.length > 0, "assistanceCode");
    H.domain(classificationSource.length > 0, "classificationSource");
    return {
      token: JSON.stringify([taskId, assistanceCode, classificationSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    taskId: "T17",
    assistanceCode: "A2",
    classificationSource: "Codebook v2",
  },
  output: { token: '["T17","A2","Codebook v2"]' },
} satisfies ToolExample<Input, Output>;
export const physiotherapyAssistanceSourceCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["physiotherapy", "health and medicine"],
      keywords: ["physiotherapy", "health and medicine"],
    },
    id: "physiotherapy/physiotherapy-assistance-source-code",
    title: "Physiotherapy Assistance Source Code",
    description:
      "Qualify a recorded assistance code by its source without scoring functional ability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskId: { type: "string", maxLength: 8192, minLength: 1 },
        assistanceCode: { type: "string", maxLength: 8192, minLength: 1 },
        classificationSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["taskId", "assistanceCode", "classificationSource"],
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
          id: "assistanceCode",
          label: "Assistance Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "classificationSource",
          label: "Classification Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = physiotherapyAssistanceSourceCodeTool.execute;
export default physiotherapyAssistanceSourceCodeTool;
