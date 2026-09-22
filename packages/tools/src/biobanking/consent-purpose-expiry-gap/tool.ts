import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedPurpose: string;
  readonly recordedPurposes: readonly string[];
  readonly checkDay: number;
  readonly expiryLower: number;
  readonly expiryUpper: number;
  readonly consentKnown: boolean;
};
export type Output = {
  readonly purposeListed: boolean;
  readonly certainlyBeforeBoundary: boolean;
  readonly ambiguousExpiry: boolean;
  readonly consentUnresolved: boolean;
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
    checkDay: { type: "integer" },
    expiryLower: { type: "integer" },
    expiryUpper: { type: "integer" },
    consentKnown: { type: "boolean" },
  },
  required: [
    "requestedPurpose",
    "recordedPurposes",
    "checkDay",
    "expiryLower",
    "expiryUpper",
    "consentKnown",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    purposeListed: { type: "boolean" },
    certainlyBeforeBoundary: { type: "boolean" },
    ambiguousExpiry: { type: "boolean" },
    consentUnresolved: { type: "boolean" },
  },
  required: [
    "purposeListed",
    "certainlyBeforeBoundary",
    "ambiguousExpiry",
    "consentUnresolved",
  ],
} as const;
/** Inspect supplied consent-purpose/expiry metadata without establishing consent validity or processing authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    requestedPurpose,
    recordedPurposes,
    checkDay,
    expiryLower,
    expiryUpper,
    consentKnown,
  } = request;
  const compute = (): Output => {
    H.domain(expiryLower <= expiryUpper);
    return {
      purposeListed: recordedPurposes.includes(requestedPurpose),
      certainlyBeforeBoundary: checkDay < expiryLower,
      ambiguousExpiry: checkDay >= expiryLower && checkDay <= expiryUpper,
      consentUnresolved: !consentKnown,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    requestedPurpose: "research",
    recordedPurposes: ["research"],
    checkDay: 110,
    expiryLower: 100,
    expiryUpper: 120,
    consentKnown: true,
  },
  output: {
    purposeListed: true,
    certainlyBeforeBoundary: false,
    ambiguousExpiry: true,
    consentUnresolved: false,
  },
} satisfies ToolExample<Input, Output>;
export const consentPurposeExpiryGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/consent-purpose-expiry-gap",
    title: "Consent Purpose Expiry Gap Tool",
    description:
      "Inspect supplied consent-purpose/expiry metadata without establishing consent validity or processing authority.",
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
        checkDay: { type: "integer" },
        expiryLower: { type: "integer" },
        expiryUpper: { type: "integer" },
        consentKnown: { type: "boolean" },
      },
      required: [
        "requestedPurpose",
        "recordedPurposes",
        "checkDay",
        "expiryLower",
        "expiryUpper",
        "consentKnown",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        purposeListed: { type: "boolean" },
        certainlyBeforeBoundary: { type: "boolean" },
        ambiguousExpiry: { type: "boolean" },
        consentUnresolved: { type: "boolean" },
      },
      required: [
        "purposeListed",
        "certainlyBeforeBoundary",
        "ambiguousExpiry",
        "consentUnresolved",
      ],
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
          id: "checkDay",
          label: "Check Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expiryLower",
          label: "Expiry Lower",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expiryUpper",
          label: "Expiry Upper",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "consentKnown",
          label: "Consent Known",
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
          id: "certainlyBeforeBoundary",
          label: "Certainly Before Boundary",
          valueType: { type: "boolean" },
        },
        {
          id: "ambiguousExpiry",
          label: "Ambiguous Expiry",
          valueType: { type: "boolean" },
        },
        {
          id: "consentUnresolved",
          label: "Consent Unresolved",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = consentPurposeExpiryGapTool.execute;
export default consentPurposeExpiryGapTool;
