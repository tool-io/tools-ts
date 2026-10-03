import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredRole: string;
  readonly heldRoles: readonly string[];
  readonly referenceDate: string;
  readonly expiryDate: string;
  readonly inclusiveExpiry: boolean;
};
export type Output = {
  readonly roleMatches: boolean;
  readonly unexpired: boolean;
  readonly authorizedByInputs: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredRole: { type: "string", maxLength: 8192 },
    heldRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    referenceDate: { type: "string", maxLength: 8192 },
    expiryDate: { type: "string", maxLength: 8192 },
    inclusiveExpiry: { type: "boolean" },
  },
  required: [
    "requiredRole",
    "heldRoles",
    "referenceDate",
    "expiryDate",
    "inclusiveExpiry",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roleMatches: { type: "boolean" },
    unexpired: { type: "boolean" },
    authorizedByInputs: { type: "boolean" },
  },
  required: ["roleMatches", "unexpired", "authorizedByInputs"],
} as const;
/** Combine caller-supplied role membership and expiry convention; no actual authority is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    requiredRole,
    heldRoles,
    referenceDate,
    expiryDate,
    inclusiveExpiry,
  } = request;
  const compute = (): Output => {
    const roleMatches = heldRoles.includes(requiredRole),
      reference = H.dateOnly(referenceDate).getTime(),
      expiry = H.dateOnly(expiryDate).getTime(),
      unexpired = inclusiveExpiry ? reference <= expiry : reference < expiry;
    return {
      roleMatches,
      unexpired,
      authorizedByInputs: roleMatches && unexpired,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requiredRole: "reviewer",
    heldRoles: ["reviewer"],
    referenceDate: "2026-10-26",
    expiryDate: "2026-10-26",
    inclusiveExpiry: true,
  },
  output: { roleMatches: true, unexpired: true, authorizedByInputs: true },
} satisfies ToolExample<Input, Output>;
export const delegatedSignatureRoleExpiryPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/delegated-signature-role-expiry-pair",
    title: "Delegated Signature Role Expiry Pair Tool",
    description:
      "Combine caller-supplied role membership and expiry convention; no actual authority is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredRole: { type: "string", maxLength: 8192 },
        heldRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        referenceDate: { type: "string", maxLength: 8192 },
        expiryDate: { type: "string", maxLength: 8192 },
        inclusiveExpiry: { type: "boolean" },
      },
      required: [
        "requiredRole",
        "heldRoles",
        "referenceDate",
        "expiryDate",
        "inclusiveExpiry",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roleMatches: { type: "boolean" },
        unexpired: { type: "boolean" },
        authorizedByInputs: { type: "boolean" },
      },
      required: ["roleMatches", "unexpired", "authorizedByInputs"],
    },
    ports: {
      inputs: [
        {
          id: "requiredRole",
          label: "Required Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "heldRoles",
          label: "Held Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "referenceDate",
          label: "Reference Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expiryDate",
          label: "Expiry Date",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "inclusiveExpiry",
          label: "Inclusive Expiry",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "roleMatches",
          label: "Role Matches",
          valueType: { type: "boolean" },
        },
        { id: "unexpired", label: "Unexpired", valueType: { type: "boolean" } },
        {
          id: "authorizedByInputs",
          label: "Authorized By Inputs",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = delegatedSignatureRoleExpiryPairTool.execute;
export default delegatedSignatureRoleExpiryPairTool;
