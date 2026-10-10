import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fieldCode: string;
  readonly recordedValue: string;
  readonly vocabularySource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fieldCode: { type: "string", maxLength: 8192, minLength: 1 },
    recordedValue: { type: "string", maxLength: 8192, minLength: 1 },
    vocabularySource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["fieldCode", "recordedValue", "vocabularySource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify a literal controlled metadata value by its supplied vocabulary source without validating membership. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fieldCode, recordedValue, vocabularySource } = request;
  const compute = (): Output => {
    H.domain(fieldCode.length > 0, "fieldCode");
    H.domain(recordedValue.length > 0, "recordedValue");
    H.domain(vocabularySource.length > 0, "vocabularySource");
    return {
      token: JSON.stringify([fieldCode, recordedValue, vocabularySource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fieldCode: "SUBJ",
    recordedValue: "V17",
    vocabularySource: "Vocabulary A v2",
  },
  output: { token: '["SUBJ","V17","Vocabulary A v2"]' },
} satisfies ToolExample<Input, Output>;
export const metadataControlledValueSourceKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "information-science",
        "information science",
        "information and language sciences",
      ],
      keywords: ["information science", "information and language sciences"],
    },
    id: "information-science/metadata-controlled-value-source-key",
    title: "Metadata Controlled Value Source Key",
    description:
      "Qualify a literal controlled metadata value by its supplied vocabulary source without validating membership.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fieldCode: { type: "string", maxLength: 8192, minLength: 1 },
        recordedValue: { type: "string", maxLength: 8192, minLength: 1 },
        vocabularySource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["fieldCode", "recordedValue", "vocabularySource"],
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
          id: "fieldCode",
          label: "Field Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedValue",
          label: "Recorded Value",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "vocabularySource",
          label: "Vocabulary Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = metadataControlledValueSourceKeyTool.execute;
export default metadataControlledValueSourceKeyTool;
