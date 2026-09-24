import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly role: string;
  readonly permittedRoles: readonly string[];
  readonly purpose: string;
  readonly permittedPurposes: readonly string[];
  readonly emergency: boolean;
  readonly emergencyAuthorized: boolean;
};
export type Output = {
  readonly roleAllowed: boolean;
  readonly purposeAllowed: boolean;
  readonly emergencyOverride: boolean;
  readonly accessible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    role: { type: "string", maxLength: 8192 },
    permittedRoles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    purpose: { type: "string", maxLength: 8192 },
    permittedPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    emergency: { type: "boolean" },
    emergencyAuthorized: { type: "boolean" },
  },
  required: [
    "role",
    "permittedRoles",
    "purpose",
    "permittedPurposes",
    "emergency",
    "emergencyAuthorized",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roleAllowed: { type: "boolean" },
    purposeAllowed: { type: "boolean" },
    emergencyOverride: { type: "boolean" },
    accessible: { type: "boolean" },
  },
  required: [
    "roleAllowed",
    "purposeAllowed",
    "emergencyOverride",
    "accessible",
  ],
} as const;
/** Evaluate supplied code-access policy flags without retrieving or revealing trial codes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    role,
    permittedRoles,
    purpose,
    permittedPurposes,
    emergency,
    emergencyAuthorized,
  } = request;
  const compute = (): Output => {
    const roleAllowed = permittedRoles.includes(role),
      purposeAllowed = permittedPurposes.includes(purpose),
      emergencyOverride = emergency && emergencyAuthorized;
    return {
      roleAllowed,
      purposeAllowed,
      emergencyOverride,
      accessible: (roleAllowed && purposeAllowed) || emergencyOverride,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    role: "monitor",
    permittedRoles: ["monitor"],
    purpose: "audit",
    permittedPurposes: ["audit"],
    emergency: false,
    emergencyAuthorized: false,
  },
  output: {
    roleAllowed: true,
    purposeAllowed: true,
    emergencyOverride: false,
    accessible: true,
  },
} satisfies ToolExample<Input, Output>;
export const trialBlindingCodeAccessScopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-trials/trial-blinding-code-access-scope",
    title: "Trial Blinding Code Access Scope Tool",
    description:
      "Evaluate supplied code-access policy flags without retrieving or revealing trial codes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        role: { type: "string", maxLength: 8192 },
        permittedRoles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        purpose: { type: "string", maxLength: 8192 },
        permittedPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        emergency: { type: "boolean" },
        emergencyAuthorized: { type: "boolean" },
      },
      required: [
        "role",
        "permittedRoles",
        "purpose",
        "permittedPurposes",
        "emergency",
        "emergencyAuthorized",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roleAllowed: { type: "boolean" },
        purposeAllowed: { type: "boolean" },
        emergencyOverride: { type: "boolean" },
        accessible: { type: "boolean" },
      },
      required: [
        "roleAllowed",
        "purposeAllowed",
        "emergencyOverride",
        "accessible",
      ],
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
          id: "permittedRoles",
          label: "Permitted Roles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "purpose",
          label: "Purpose",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permittedPurposes",
          label: "Permitted Purposes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "emergency",
          label: "Emergency",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "emergencyAuthorized",
          label: "Emergency Authorized",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "roleAllowed",
          label: "Role Allowed",
          valueType: { type: "boolean" },
        },
        {
          id: "purposeAllowed",
          label: "Purpose Allowed",
          valueType: { type: "boolean" },
        },
        {
          id: "emergencyOverride",
          label: "Emergency Override",
          valueType: { type: "boolean" },
        },
        {
          id: "accessible",
          label: "Accessible",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialBlindingCodeAccessScopeTool.execute;
export default trialBlindingCodeAccessScopeTool;
