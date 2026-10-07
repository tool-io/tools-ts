import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly participantId: string;
  readonly recordedChoice: string;
  readonly preferenceSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    participantId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedChoice: { type: "string", maxLength: 8192, minLength: 1 },
    preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["participantId", "recordedChoice", "preferenceSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit incidental-finding return preference without interpreting findings or communicating results. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { participantId, recordedChoice, preferenceSource } = request;
  const compute = (): Output => {
    H.domain(participantId.length > 0, "participantId");
    H.domain(recordedChoice.length > 0, "recordedChoice");
    H.domain(preferenceSource.length > 0, "preferenceSource");
    return {
      token: JSON.stringify([participantId, recordedChoice, preferenceSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    participantId: "P17",
    recordedChoice: "return requested",
    preferenceSource: "Participant form",
  },
  output: { token: '["P17","return requested","Participant form"]' },
} satisfies ToolExample<Input, Output>;
export const incidentalFindingReturnChoiceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bioethics", "research and quality management"],
      keywords: ["bioethics", "research and quality management"],
    },
    id: "bioethics/incidental-finding-return-choice-token",
    title: "Incidental Finding Return Choice Token",
    description:
      "Preserve an explicit incidental-finding return preference without interpreting findings or communicating results.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        participantId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedChoice: { type: "string", maxLength: 8192, minLength: 1 },
        preferenceSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["participantId", "recordedChoice", "preferenceSource"],
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
          id: "recordedChoice",
          label: "Recorded Choice",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = incidentalFindingReturnChoiceTokenTool.execute;
export default incidentalFindingReturnChoiceTokenTool;
