import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedPurpose: string;
  readonly permittedPurposes: readonly string[];
  readonly recontactKnown: boolean;
  readonly recontactGranted: boolean;
};
export type Output = {
  readonly purposeListed: boolean;
  readonly permittedUnderFlags: boolean;
  readonly unresolved: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedPurpose: { type: "string", maxLength: 8192 },
    permittedPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recontactKnown: { type: "boolean" },
    recontactGranted: { type: "boolean" },
  },
  required: [
    "requestedPurpose",
    "permittedPurposes",
    "recontactKnown",
    "recontactGranted",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purposeListed: { type: "boolean" },
    permittedUnderFlags: { type: "boolean" },
    unresolved: { type: "boolean" },
  },
  required: ["purposeListed", "permittedUnderFlags", "unresolved"],
} as const;
/** Compare supplied recontact-purpose and consent flags without establishing legal authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    requestedPurpose,
    permittedPurposes,
    recontactKnown,
    recontactGranted,
  } = request;
  const compute = (): Output => {
    const purposeListed = permittedPurposes.includes(requestedPurpose);
    return {
      purposeListed,
      permittedUnderFlags: purposeListed && recontactKnown && recontactGranted,
      unresolved: !recontactKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestedPurpose: "followup",
    permittedPurposes: ["followup"],
    recontactKnown: true,
    recontactGranted: true,
  },
  output: { purposeListed: true, permittedUnderFlags: true, unresolved: false },
} satisfies ToolExample<Input, Output>;
export const consentRecontactScopeFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/consent-recontact-scope-flag",
    title: "Consent Recontact Scope Flag Tool",
    description:
      "Compare supplied recontact-purpose and consent flags without establishing legal authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedPurpose: { type: "string", maxLength: 8192 },
        permittedPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        recontactKnown: { type: "boolean" },
        recontactGranted: { type: "boolean" },
      },
      required: [
        "requestedPurpose",
        "permittedPurposes",
        "recontactKnown",
        "recontactGranted",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purposeListed: { type: "boolean" },
        permittedUnderFlags: { type: "boolean" },
        unresolved: { type: "boolean" },
      },
      required: ["purposeListed", "permittedUnderFlags", "unresolved"],
    },
    ports: {
      inputs: [
        {
          id: "requestedPurpose",
          label: "Requested Purpose",
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
          id: "recontactKnown",
          label: "Recontact Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "recontactGranted",
          label: "Recontact Granted",
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
          id: "permittedUnderFlags",
          label: "Permitted Under Flags",
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
export const run = consentRecontactScopeFlagTool.execute;
export default consentRecontactScopeFlagTool;
