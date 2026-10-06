import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskId: string;
  readonly operationCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskId: { type: "string", maxLength: 8192, minLength: 1 },
    operationCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["taskId", "operationCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit agricultural operation code by source without identifying an operation from telemetry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskId, operationCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(taskId.length > 0, "taskId");
    H.domain(operationCode.length > 0, "operationCode");
    H.domain(codeSource.length > 0, "codeSource");
    return { token: JSON.stringify([taskId, operationCode, codeSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taskId: "TASK17", operationCode: "OP2", codeSource: "Farm key A" },
  output: { token: '["TASK17","OP2","Farm key A"]' },
} satisfies ToolExample<Input, Output>;
export const agriculturalOperationTypeCodeTool = H.defineSchemaCalculation<
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
    id: "agroinformatics/agricultural-operation-type-code",
    title: "Agricultural Operation Type Code",
    description:
      "Qualify an explicit agricultural operation code by source without identifying an operation from telemetry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskId: { type: "string", maxLength: 8192, minLength: 1 },
        operationCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["taskId", "operationCode", "codeSource"],
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
          id: "operationCode",
          label: "Operation Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codeSource",
          label: "Code Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = agriculturalOperationTypeCodeTool.execute;
export default agriculturalOperationTypeCodeTool;
