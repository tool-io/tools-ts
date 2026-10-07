import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly encounterId: string;
  readonly languageCode: string;
  readonly interpreterRecordId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    encounterId: { type: "string", maxLength: 8192, minLength: 1 },
    languageCode: { type: "string", maxLength: 8192, minLength: 1 },
    interpreterRecordId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["encounterId", "languageCode", "interpreterRecordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify an explicit counseling language by encounter and interpreter record without inferring comprehension. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { encounterId, languageCode, interpreterRecordId } = request;
  const compute = (): Output => {
    H.domain(encounterId.length > 0, "encounterId");
    H.domain(languageCode.length > 0, "languageCode");
    H.domain(interpreterRecordId.length > 0, "interpreterRecordId");
    return {
      token: JSON.stringify([encounterId, languageCode, interpreterRecordId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    encounterId: "ENC17",
    languageCode: "es",
    interpreterRecordId: "INT2",
  },
  output: { token: '["ENC17","es","INT2"]' },
} satisfies ToolExample<Input, Output>;
export const medicationCounselingLanguageKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["clinical-pharmacy", "clinical pharmacy", "pharmacy"],
      keywords: ["clinical pharmacy", "pharmacy"],
    },
    id: "clinical-pharmacy/medication-counseling-language-key",
    title: "Medication Counseling Language Key",
    description:
      "Qualify an explicit counseling language by encounter and interpreter record without inferring comprehension.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        encounterId: { type: "string", maxLength: 8192, minLength: 1 },
        languageCode: { type: "string", maxLength: 8192, minLength: 1 },
        interpreterRecordId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["encounterId", "languageCode", "interpreterRecordId"],
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
          id: "encounterId",
          label: "Encounter Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "languageCode",
          label: "Language Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "interpreterRecordId",
          label: "Interpreter Record Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = medicationCounselingLanguageKeyTool.execute;
export default medicationCounselingLanguageKeyTool;
