import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly clientRecordId: string;
  readonly userOccupationCode: string;
  readonly codeSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    clientRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    userOccupationCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["clientRecordId", "userOccupationCode", "codeSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a user-assigned occupation code and source without assigning occupational identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { clientRecordId, userOccupationCode, codeSource } = request;
  const compute = (): Output => {
    H.domain(clientRecordId.length > 0, "clientRecordId");
    H.domain(userOccupationCode.length > 0, "userOccupationCode");
    H.domain(codeSource.length > 0, "codeSource");
    return {
      token: JSON.stringify([clientRecordId, userOccupationCode, codeSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    clientRecordId: "C17",
    userOccupationCode: "ROLE-A",
    codeSource: "Client wording",
  },
  output: { token: '["C17","ROLE-A","Client wording"]' },
} satisfies ToolExample<Input, Output>;
export const clientOccupationUserCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-therapy",
        "occupational therapy",
        "health and medicine",
      ],
      keywords: ["occupational therapy", "health and medicine"],
    },
    id: "occupational-therapy/client-occupation-user-code",
    title: "Client Occupation User Code",
    description:
      "Record a user-assigned occupation code and source without assigning occupational identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        clientRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        userOccupationCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["clientRecordId", "userOccupationCode", "codeSource"],
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
          id: "clientRecordId",
          label: "Client Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "userOccupationCode",
          label: "User Occupation Code",
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
export const run = clientOccupationUserCodeTool.execute;
export default clientOccupationUserCodeTool;
