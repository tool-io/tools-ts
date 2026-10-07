import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly utteranceId: string;
  readonly speakerCode: string;
  readonly reporterAssignedRole: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utteranceId: { type: "string", maxLength: 8192, minLength: 1 },
    speakerCode: { type: "string", maxLength: 8192, minLength: 1 },
    reporterAssignedRole: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["utteranceId", "speakerCode", "reporterAssignedRole"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Encode an explicit utterance/speaker/role annotation without identifying speakers or evaluating language. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { utteranceId, speakerCode, reporterAssignedRole } = request;
  const compute = (): Output => {
    H.domain(
      utteranceId.length > 0 &&
        speakerCode.length > 0 &&
        reporterAssignedRole.length > 0,
      "utteranceId",
    );
    return {
      tag: JSON.stringify([utteranceId, speakerCode, reporterAssignedRole]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    utteranceId: "U17",
    speakerCode: "S1",
    reporterAssignedRole: "child",
  },
  output: { tag: '["U17","S1","child"]' },
} satisfies ToolExample<Input, Output>;
export const childLanguageUtteranceSpeakerTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["child-development", "child development", "psychology"],
      keywords: ["child development", "psychology"],
    },
    id: "child-development/child-language-utterance-speaker-tag",
    title: "Child Language Utterance Speaker Tag",
    description:
      "Encode an explicit utterance/speaker/role annotation without identifying speakers or evaluating language.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utteranceId: { type: "string", maxLength: 8192, minLength: 1 },
        speakerCode: { type: "string", maxLength: 8192, minLength: 1 },
        reporterAssignedRole: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["utteranceId", "speakerCode", "reporterAssignedRole"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "utteranceId",
          label: "Utterance Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "speakerCode",
          label: "Speaker Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "reporterAssignedRole",
          label: "Reporter Assigned Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = childLanguageUtteranceSpeakerTagTool.execute;
export default childLanguageUtteranceSpeakerTagTool;
