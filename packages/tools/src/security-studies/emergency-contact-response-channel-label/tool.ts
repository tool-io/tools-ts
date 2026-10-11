import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactRecordId: string;
  readonly suppliedResponseChannel: string;
  readonly preferenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedResponseChannel: { type: "string", maxLength: 8192, minLength: 1 },
    preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["contactRecordId", "suppliedResponseChannel", "preferenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit emergency-contact response-channel preference without contacting anyone. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactRecordId, suppliedResponseChannel, preferenceSource } =
    request;
  const compute = (): Output => {
    H.domain(contactRecordId.length > 0, "contactRecordId");
    H.domain(suppliedResponseChannel.length > 0, "suppliedResponseChannel");
    H.domain(preferenceSource.length > 0, "preferenceSource");
    return {
      token: JSON.stringify([
        contactRecordId,
        suppliedResponseChannel,
        preferenceSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    contactRecordId: "C17",
    suppliedResponseChannel: "phone",
    preferenceSource: "Contact form",
  },
  output: { token: '["C17","phone","Contact form"]' },
} satisfies ToolExample<Input, Output>;
export const emergencyContactResponseChannelLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["security-studies", "security studies", "social sciences"],
        keywords: ["security studies", "social sciences"],
      },
      id: "security-studies/emergency-contact-response-channel-label",
      title: "Emergency Contact Response Channel Label",
      description:
        "Preserve an explicit emergency-contact response-channel preference without contacting anyone.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contactRecordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedResponseChannel: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: [
          "contactRecordId",
          "suppliedResponseChannel",
          "preferenceSource",
        ],
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
            id: "contactRecordId",
            label: "Contact Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedResponseChannel",
            label: "Supplied Response Channel",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "preferenceSource",
            label: "Preference Source",
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
export const run = emergencyContactResponseChannelLabelTool.execute;
export default emergencyContactResponseChannelLabelTool;
