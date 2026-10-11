import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roleId: string;
  readonly primaryRecordId: string;
  readonly deputyRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roleId: { type: "string", maxLength: 8192, minLength: 1 },
    primaryRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    deputyRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["roleId", "primaryRecordId", "deputyRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Pair explicit primary and deputy continuity-role identifiers without granting access or authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roleId, primaryRecordId, deputyRecordId } = request;
  const compute = (): Output => {
    H.domain(roleId.length > 0, "roleId");
    H.domain(primaryRecordId.length > 0, "primaryRecordId");
    H.domain(deputyRecordId.length > 0, "deputyRecordId");
    return { token: JSON.stringify([roleId, primaryRecordId, deputyRecordId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { roleId: "ROLE17", primaryRecordId: "P2", deputyRecordId: "D2" },
  output: { token: '["ROLE17","P2","D2"]' },
} satisfies ToolExample<Input, Output>;
export const continuityRolePrimaryDeputyLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["security-studies", "security studies", "social sciences"],
      keywords: ["security studies", "social sciences"],
    },
    id: "security-studies/continuity-role-primary-deputy-label",
    title: "Continuity Role Primary Deputy Label",
    description:
      "Pair explicit primary and deputy continuity-role identifiers without granting access or authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roleId: { type: "string", maxLength: 8192, minLength: 1 },
        primaryRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        deputyRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["roleId", "primaryRecordId", "deputyRecordId"],
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
          id: "roleId",
          label: "Role Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "primaryRecordId",
          label: "Primary Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "deputyRecordId",
          label: "Deputy Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = continuityRolePrimaryDeputyLabelTool.execute;
export default continuityRolePrimaryDeputyLabelTool;
