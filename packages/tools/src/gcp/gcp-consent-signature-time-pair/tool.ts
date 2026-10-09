import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly consentVersion: string;
  readonly participantSignatureSeconds: number;
  readonly investigatorSignatureSeconds: number;
};
export type Output = {
  readonly investigatorMinusParticipantSeconds: number;
  readonly token: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consentVersion: { type: "string", maxLength: 8192, minLength: 1 },
    participantSignatureSeconds: { type: "number" },
    investigatorSignatureSeconds: { type: "number" },
  },
  required: [
    "consentVersion",
    "participantSignatureSeconds",
    "investigatorSignatureSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    investigatorMinusParticipantSeconds: { type: "number" },
    token: { type: "string", maxLength: 8192 },
  },
  required: ["investigatorMinusParticipantSeconds", "token"],
} as const;
/** Pair explicit signature time markers and report their signed difference without determining consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    consentVersion,
    participantSignatureSeconds,
    investigatorSignatureSeconds,
  } = request;
  const compute = (): Output => {
    H.domain(consentVersion.length > 0, "consentVersion");
    return {
      investigatorMinusParticipantSeconds:
        investigatorSignatureSeconds - participantSignatureSeconds,
      token: JSON.stringify([
        consentVersion,
        participantSignatureSeconds,
        investigatorSignatureSeconds,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    consentVersion: "v2",
    participantSignatureSeconds: 1000,
    investigatorSignatureSeconds: 1060,
  },
  output: {
    investigatorMinusParticipantSeconds: 60,
    token: '["v2",1000,1060]',
  },
} satisfies ToolExample<Input, Output>;
export const gcpConsentSignatureTimePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "gcp",
        "good clinical practice",
        "research and quality management",
      ],
      keywords: [
        "good clinical practice",
        "research and quality management",
        "GCP",
      ],
    },
    id: "gcp/gcp-consent-signature-time-pair",
    title: "GCP Consent Signature Time Pair",
    description:
      "Pair explicit signature time markers and report their signed difference without determining consent validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consentVersion: { type: "string", maxLength: 8192, minLength: 1 },
        participantSignatureSeconds: { type: "number" },
        investigatorSignatureSeconds: { type: "number" },
      },
      required: [
        "consentVersion",
        "participantSignatureSeconds",
        "investigatorSignatureSeconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        investigatorMinusParticipantSeconds: { type: "number" },
        token: { type: "string", maxLength: 8192 },
      },
      required: ["investigatorMinusParticipantSeconds", "token"],
    },
    ports: {
      inputs: [
        {
          id: "consentVersion",
          label: "Consent Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "participantSignatureSeconds",
          label: "Participant Signature Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "investigatorSignatureSeconds",
          label: "Investigator Signature Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "investigatorMinusParticipantSeconds",
          label: "Investigator Minus Participant Seconds",
          valueType: { type: "number" },
        },
        { id: "token", label: "Token", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = gcpConsentSignatureTimePairTool.execute;
export default gcpConsentSignatureTimePairTool;
