import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly consentVersion: string;
  readonly reconsentRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    consentVersion: { type: "string", maxLength: 8192, minLength: 1 },
    reconsentRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "consentVersion", "reconsentRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit reconsent record by participant and version without deciding consent validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, consentVersion, reconsentRecordId } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(consentVersion.length > 0, "consentVersion");
    H.domain(reconsentRecordId.length > 0, "reconsentRecordId");
    return {
      token: JSON.stringify([participantId, consentVersion, reconsentRecordId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantId: "P17",
    consentVersion: "v2",
    reconsentRecordId: "RC2",
  },
  output: { token: '["P17","v2","RC2"]' },
} satisfies ToolExample<Input, Output>;
export const gcpReconsentVersionLabelTool = H.defineSchemaCalculation<
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
    id: "gcp/gcp-reconsent-version-label",
    title: "GCP Reconsent Version Label",
    description:
      "Qualify an explicit reconsent record by participant and version without deciding consent validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantId: { type: "string", maxLength: 8192, minLength: 1 },
        consentVersion: { type: "string", maxLength: 8192, minLength: 1 },
        reconsentRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["participantId", "consentVersion", "reconsentRecordId"],
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
          id: "participantId",
          label: "Participant Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "consentVersion",
          label: "Consent Version",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reconsentRecordId",
          label: "Reconsent Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = gcpReconsentVersionLabelTool.execute;
export default gcpReconsentVersionLabelTool;
