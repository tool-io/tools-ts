import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly screeningId: string;
  readonly participantId: string;
  readonly suppliedConsentStatus: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    screeningId: { type: "string", maxLength: 8192, minLength: 1 },
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedConsentStatus: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["screeningId", "participantId", "suppliedConsentStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve supplied oral-health screening consent metadata without establishing permission or clinical eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { screeningId, participantId, suppliedConsentStatus } = request;
  const compute = (): Output => {
    H.domain(screeningId.length > 0, "screeningId");
    H.domain(participantId.length > 0, "participantId");
    H.domain(suppliedConsentStatus.length > 0, "suppliedConsentStatus");
    return {
      token: JSON.stringify([
        screeningId,
        participantId,
        suppliedConsentStatus,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    screeningId: "S17",
    participantId: "P4",
    suppliedConsentStatus: "recorded",
  },
  output: { token: '["S17","P4","recorded"]' },
} satisfies ToolExample<Input, Output>;
export const communityOralHealthScreeningConsentTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "dental-hygiene/community-oral-health-screening-consent-tag",
      title: "Community Oral Health Screening Consent Tag Tool",
      description:
        "Preserve supplied oral-health screening consent metadata without establishing permission or clinical eligibility.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          screeningId: { type: "string", maxLength: 8192, minLength: 1 },
          participantId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedConsentStatus: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["screeningId", "participantId", "suppliedConsentStatus"],
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
            id: "screeningId",
            label: "Screening Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "participantId",
            label: "Participant Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedConsentStatus",
            label: "Supplied Consent Status",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = communityOralHealthScreeningConsentTagTool.execute;
export default communityOralHealthScreeningConsentTagTool;
