import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly operatorId: string;
  readonly signedOperatorId: string;
  readonly role: string;
  readonly authorizedRoles: readonly string[];
  readonly signedAt: number;
  readonly validFrom: number;
  readonly validTo: number;
};
export type Output = {
  readonly identityMatches: boolean;
  readonly roleAllowed: boolean;
  readonly timeAllowed: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    operatorId: { type: "string", maxLength: 8192 },
    signedOperatorId: { type: "string", maxLength: 8192 },
    role: { type: "string", maxLength: 8192 },
    authorizedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    signedAt: { type: "number" },
    validFrom: { type: "number" },
    validTo: { type: "number" },
  },
  required: [
    "operatorId",
    "signedOperatorId",
    "role",
    "authorizedRoles",
    "signedAt",
    "validFrom",
    "validTo",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    identityMatches: { type: "boolean" },
    roleAllowed: { type: "boolean" },
    timeAllowed: { type: "boolean" },
  },
  required: ["identityMatches", "roleAllowed", "timeAllowed"],
} as const;
/** Audit supplied operator-signature role and time metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    operatorId,
    signedOperatorId,
    role,
    authorizedRoles,
    signedAt,
    validFrom,
    validTo,
  } = request;
  const compute = (): Output => {
    H.domain(validTo >= validFrom);
    return {
      identityMatches: operatorId === signedOperatorId,
      roleAllowed: authorizedRoles.includes(role),
      timeAllowed: signedAt >= validFrom && signedAt <= validTo,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    operatorId: "O1",
    signedOperatorId: "O1",
    role: "operator",
    authorizedRoles: ["operator"],
    signedAt: 105,
    validFrom: 100,
    validTo: 110,
  },
  output: { identityMatches: true, roleAllowed: true, timeAllowed: true },
} satisfies ToolExample<Input, Output>;
export const gmpOperatorSignatureRoleWindowTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gmp/gmp-operator-signature-role-window",
    title: "GMP Operator Signature Role Window Tool",
    description: "Audit supplied operator-signature role and time metadata.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        operatorId: { type: "string", maxLength: 8192 },
        signedOperatorId: { type: "string", maxLength: 8192 },
        role: { type: "string", maxLength: 8192 },
        authorizedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        signedAt: { type: "number" },
        validFrom: { type: "number" },
        validTo: { type: "number" },
      },
      required: [
        "operatorId",
        "signedOperatorId",
        "role",
        "authorizedRoles",
        "signedAt",
        "validFrom",
        "validTo",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        identityMatches: { type: "boolean" },
        roleAllowed: { type: "boolean" },
        timeAllowed: { type: "boolean" },
      },
      required: ["identityMatches", "roleAllowed", "timeAllowed"],
    },
    ports: {
      inputs: [
        {
          id: "operatorId",
          label: "Operator Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "signedOperatorId",
          label: "Signed Operator Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "role",
          label: "Role",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authorizedRoles",
          label: "Authorized Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "signedAt",
          label: "Signed At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "validFrom",
          label: "Valid From",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "validTo",
          label: "Valid To",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "identityMatches",
          label: "Identity Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "roleAllowed",
          label: "Role Allowed",
          valueType: { type: "boolean" },
        },
        {
          id: "timeAllowed",
          label: "Time Allowed",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = gmpOperatorSignatureRoleWindowTool.execute;
export default gmpOperatorSignatureRoleWindowTool;
