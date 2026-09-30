import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedPurpose: string;
  readonly recordedPurposes: readonly string[];
  readonly consentKnown: boolean;
  readonly consentGranted: boolean;
};
export type Output = {
  readonly purposeRecorded: boolean;
  readonly permittedUnderFlags: boolean;
  readonly unresolved: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedPurpose: { type: "string", maxLength: 8192 },
    recordedPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    consentKnown: { type: "boolean" },
    consentGranted: { type: "boolean" },
  },
  required: [
    "requestedPurpose",
    "recordedPurposes",
    "consentKnown",
    "consentGranted",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purposeRecorded: { type: "boolean" },
    permittedUnderFlags: { type: "boolean" },
    unresolved: { type: "boolean" },
  },
  required: ["purposeRecorded", "permittedUnderFlags", "unresolved"],
} as const;
/** Compare supplied purpose/consent record flags only; does not determine legal authority to process records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedPurpose, recordedPurposes, consentKnown, consentGranted } =
    request;
  const compute = (): Output => {
    const purposeRecorded = recordedPurposes.includes(requestedPurpose);
    return {
      purposeRecorded,
      permittedUnderFlags: consentKnown && consentGranted && purposeRecorded,
      unresolved: !consentKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestedPurpose: "research",
    recordedPurposes: ["care"],
    consentKnown: true,
    consentGranted: true,
  },
  output: {
    purposeRecorded: false,
    permittedUnderFlags: false,
    unresolved: false,
  },
} satisfies ToolExample<Input, Output>;
export const maternityLinkConsentPurposeFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "midwifery/maternity-link-consent-purpose-flag",
    title: "Maternity Link Consent Purpose Flag Tool",
    description:
      "Compare supplied purpose/consent record flags only; does not determine legal authority to process records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedPurpose: { type: "string", maxLength: 8192 },
        recordedPurposes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        consentKnown: { type: "boolean" },
        consentGranted: { type: "boolean" },
      },
      required: [
        "requestedPurpose",
        "recordedPurposes",
        "consentKnown",
        "consentGranted",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purposeRecorded: { type: "boolean" },
        permittedUnderFlags: { type: "boolean" },
        unresolved: { type: "boolean" },
      },
      required: ["purposeRecorded", "permittedUnderFlags", "unresolved"],
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
          id: "recordedPurposes",
          label: "Recorded Purposes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "consentKnown",
          label: "Consent Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "consentGranted",
          label: "Consent Granted",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "purposeRecorded",
          label: "Purpose Recorded",
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
export const run = maternityLinkConsentPurposeFlagTool.execute;
export default maternityLinkConsentPurposeFlagTool;
