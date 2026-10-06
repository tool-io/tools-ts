import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly callId: string;
  readonly argumentName: string;
  readonly schemaPointer: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    callId: { type: "string", maxLength: 8192, minLength: 1 },
    argumentName: { type: "string", maxLength: 8192, minLength: 1 },
    schemaPointer: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["callId", "argumentName", "schemaPointer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate one supplied tool-call argument with an explicit schema-pointer transcription without resolving or validating a schema. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { callId, argumentName, schemaPointer } = request;
  const compute = (): Output => {
    H.domain(callId.length > 0, "callId");
    H.domain(argumentName.length > 0, "argumentName");
    H.domain(schemaPointer.length > 0, "schemaPointer");
    return { token: JSON.stringify([callId, argumentName, schemaPointer]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    callId: "C17",
    argumentName: "amount",
    schemaPointer: "/properties/amount",
  },
  output: { token: '["C17","amount","/properties/amount"]' },
} satisfies ToolExample<Input, Output>;
export const toolCallArgumentSchemaPathTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["ai", "data"],
      fields: [
        "artificial-intelligence",
        "artificial intelligence",
        "computer science",
      ],
      keywords: ["artificial intelligence", "computer science"],
    },
    id: "artificial-intelligence/tool-call-argument-schema-path",
    title: "Tool Call Argument Schema Path",
    description:
      "Associate one supplied tool-call argument with an explicit schema-pointer transcription without resolving or validating a schema.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        callId: { type: "string", maxLength: 8192, minLength: 1 },
        argumentName: { type: "string", maxLength: 8192, minLength: 1 },
        schemaPointer: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["callId", "argumentName", "schemaPointer"],
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
          id: "callId",
          label: "Call Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "argumentName",
          label: "Argument Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "schemaPointer",
          label: "Schema Pointer",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = toolCallArgumentSchemaPathTool.execute;
export default toolCallArgumentSchemaPathTool;
