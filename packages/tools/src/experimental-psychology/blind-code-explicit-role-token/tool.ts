import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly code: string;
  readonly requestedRole: string;
  readonly allowedRoles: readonly string[];
  readonly revoked: boolean;
};
export type Output = { readonly allowedByFlags: boolean; readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    requestedRole: { type: "string", maxLength: 8192 },
    allowedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    revoked: { type: "boolean" },
  },
  required: ["code", "requestedRole", "allowedRoles", "revoked"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allowedByFlags: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["allowedByFlags", "key"],
} as const;
/** Evaluate supplied role metadata without resolving, disclosing or changing a research blind code. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { code, requestedRole, allowedRoles, revoked } = request;
  const compute = (): Output => {
    return {
      allowedByFlags: allowedRoles.includes(requestedRole) && !revoked,
      key: JSON.stringify([code, requestedRole]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    code: "X1",
    requestedRole: "analyst",
    allowedRoles: ["analyst"],
    revoked: false,
  },
  output: { allowedByFlags: true, key: '["X1","analyst"]' },
} satisfies ToolExample<Input, Output>;
export const blindCodeExplicitRoleTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/blind-code-explicit-role-token",
    title: "Blind Code Explicit Role Token Tool",
    description:
      "Evaluate supplied role metadata without resolving, disclosing or changing a research blind code.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        code: { type: "string", maxLength: 8192 },
        requestedRole: { type: "string", maxLength: 8192 },
        allowedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        revoked: { type: "boolean" },
      },
      required: ["code", "requestedRole", "allowedRoles", "revoked"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allowedByFlags: { type: "boolean" },
        key: { type: "string", maxLength: 8192 },
      },
      required: ["allowedByFlags", "key"],
    },
    ports: {
      inputs: [
        {
          id: "code",
          label: "Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "requestedRole",
          label: "Requested Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedRoles",
          label: "Allowed Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "revoked",
          label: "Revoked",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "allowedByFlags",
          label: "Allowed By Flags",
          valueType: { type: "boolean" },
        },
        { id: "key", label: "Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = blindCodeExplicitRoleTokenTool.execute;
export default blindCodeExplicitRoleTokenTool;
