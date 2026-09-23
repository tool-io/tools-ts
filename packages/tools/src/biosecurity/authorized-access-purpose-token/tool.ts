import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly purpose: string;
  readonly suppliedAllowedPurposes: readonly string[];
  readonly authorizationKnown: boolean;
  readonly authorizationGranted: boolean;
};
export type Output = {
  readonly purposeListed: boolean;
  readonly allowedUnderFlags: boolean;
  readonly unresolved: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purpose: { type: "string", maxLength: 8192 },
    suppliedAllowedPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    authorizationKnown: { type: "boolean" },
    authorizationGranted: { type: "boolean" },
  },
  required: [
    "purpose",
    "suppliedAllowedPurposes",
    "authorizationKnown",
    "authorizationGranted",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purposeListed: { type: "boolean" },
    allowedUnderFlags: { type: "boolean" },
    unresolved: { type: "boolean" },
  },
  required: ["purposeListed", "allowedUnderFlags", "unresolved"],
} as const;
/** Compare supplied generic access-purpose metadata; does not grant access or infer legal authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    purpose,
    suppliedAllowedPurposes,
    authorizationKnown,
    authorizationGranted,
  } = request;
  const compute = (): Output => {
    const purposeListed = suppliedAllowedPurposes.includes(purpose);
    return {
      purposeListed,
      allowedUnderFlags:
        purposeListed && authorizationKnown && authorizationGranted,
      unresolved: !authorizationKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    purpose: "audit",
    suppliedAllowedPurposes: ["audit", "maintenance"],
    authorizationKnown: true,
    authorizationGranted: true,
  },
  output: { purposeListed: true, allowedUnderFlags: true, unresolved: false },
} satisfies ToolExample<Input, Output>;
export const authorizedAccessPurposeTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosecurity/authorized-access-purpose-token",
    title: "Authorized Access Purpose Token Tool",
    description:
      "Compare supplied generic access-purpose metadata; does not grant access or infer legal authorization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purpose: { type: "string", maxLength: 8192 },
        suppliedAllowedPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        authorizationKnown: { type: "boolean" },
        authorizationGranted: { type: "boolean" },
      },
      required: [
        "purpose",
        "suppliedAllowedPurposes",
        "authorizationKnown",
        "authorizationGranted",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purposeListed: { type: "boolean" },
        allowedUnderFlags: { type: "boolean" },
        unresolved: { type: "boolean" },
      },
      required: ["purposeListed", "allowedUnderFlags", "unresolved"],
    },
    ports: {
      inputs: [
        {
          id: "purpose",
          label: "Purpose",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAllowedPurposes",
          label: "Supplied Allowed Purposes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "authorizationKnown",
          label: "Authorization Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "authorizationGranted",
          label: "Authorization Granted",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "purposeListed",
          label: "Purpose Listed",
          valueType: { type: "boolean" },
        },
        {
          id: "allowedUnderFlags",
          label: "Allowed Under Flags",
          valueType: { type: "boolean" },
        },
        {
          id: "unresolved",
          label: "Unresolved",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorizedAccessPurposeTokenTool.execute;
export default authorizedAccessPurposeTokenTool;
