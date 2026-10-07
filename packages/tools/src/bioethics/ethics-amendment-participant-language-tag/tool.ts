import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amendmentId: string;
  readonly participantRecordId: string;
  readonly languageCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amendmentId: { type: "string", maxLength: 8192, minLength: 1 },
    participantRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    languageCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["amendmentId", "participantRecordId", "languageCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit ethics amendment record by participant and supplied language code without assessing comprehension. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amendmentId, participantRecordId, languageCode } = request;
  const compute = (): Output => {
    H.domain(amendmentId.length > 0, "amendmentId");
    H.domain(participantRecordId.length > 0, "participantRecordId");
    H.domain(languageCode.length > 0, "languageCode");
    return {
      token: JSON.stringify([amendmentId, participantRecordId, languageCode]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    amendmentId: "AMD17",
    participantRecordId: "P2",
    languageCode: "es",
  },
  output: { token: '["AMD17","P2","es"]' },
} satisfies ToolExample<Input, Output>;
export const ethicsAmendmentParticipantLanguageTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: ["bioethics", "research and quality management"],
        keywords: ["bioethics", "research and quality management"],
      },
      id: "bioethics/ethics-amendment-participant-language-tag",
      title: "Ethics Amendment Participant Language Tag",
      description:
        "Qualify an explicit ethics amendment record by participant and supplied language code without assessing comprehension.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          amendmentId: { type: "string", maxLength: 8192, minLength: 1 },
          participantRecordId: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          languageCode: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["amendmentId", "participantRecordId", "languageCode"],
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
            id: "amendmentId",
            label: "Amendment Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "participantRecordId",
            label: "Participant Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "languageCode",
            label: "Language Code",
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
export const run = ethicsAmendmentParticipantLanguageTagTool.execute;
export default ethicsAmendmentParticipantLanguageTagTool;
