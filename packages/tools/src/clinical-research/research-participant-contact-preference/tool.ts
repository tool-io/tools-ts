import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly methodWording: string;
  readonly preferenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    methodWording: { type: "string", maxLength: 8192, minLength: 1 },
    preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "methodWording", "preferenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit research contact preference without sending messages or assessing consent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, methodWording, preferenceSource } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(methodWording.length > 0, "methodWording");
    H.domain(preferenceSource.length > 0, "preferenceSource");
    return {
      token: JSON.stringify([participantId, methodWording, preferenceSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantId: "P17",
    methodWording: "email",
    preferenceSource: "Participant form",
  },
  output: { token: '["P17","email","Participant form"]' },
} satisfies ToolExample<Input, Output>;
export const researchParticipantContactPreferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "clinical-research",
          "clinical research",
          "research and quality management",
        ],
        keywords: ["clinical research", "research and quality management"],
      },
      id: "clinical-research/research-participant-contact-preference",
      title: "Research Participant Contact Preference",
      description:
        "Preserve an explicit research contact preference without sending messages or assessing consent.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          participantId: { type: "string", maxLength: 8192, minLength: 1 },
          methodWording: { type: "string", maxLength: 8192, minLength: 1 },
          preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["participantId", "methodWording", "preferenceSource"],
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
            id: "methodWording",
            label: "Method Wording",
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
export const run = researchParticipantContactPreferenceTool.execute;
export default researchParticipantContactPreferenceTool;
