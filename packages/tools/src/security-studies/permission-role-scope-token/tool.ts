import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly role: string;
  readonly resourceScope: string;
  readonly action: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    role: { type: "string", maxLength: 8192 },
    resourceScope: { type: "string", maxLength: 8192 },
    action: { type: "string", maxLength: 8192 },
  },
  required: ["role", "resourceScope", "action"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode explicit role, resource-scope and action fields without granting permission or evaluating an access-control policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { role, resourceScope, action } = request;
  const compute = (): Output => {
    H.domain(
      role.length > 0 && resourceScope.length > 0 && action.length > 0,
      "role",
    );
    return { token: JSON.stringify([role, resourceScope, action]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { role: "reader", resourceScope: "reports", action: "view" },
  output: { token: '["reader","reports","view"]' },
} satisfies ToolExample<Input, Output>;
export const permissionRoleScopeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "security-studies/permission-role-scope-token",
    title: "Permission Role Scope Token Tool",
    description:
      "Encode explicit role, resource-scope and action fields without granting permission or evaluating an access-control policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        role: { type: "string", maxLength: 8192 },
        resourceScope: { type: "string", maxLength: 8192 },
        action: { type: "string", maxLength: 8192 },
      },
      required: ["role", "resourceScope", "action"],
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
          id: "role",
          label: "Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "resourceScope",
          label: "Resource Scope",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "action",
          label: "Action",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = permissionRoleScopeTokenTool.execute;
export default permissionRoleScopeTokenTool;
