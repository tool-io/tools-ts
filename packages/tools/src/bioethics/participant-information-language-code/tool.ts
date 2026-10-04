import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly languageCode: string;
  readonly documentVersion: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    languageCode: { type: "string", maxLength: 8192 },
    documentVersion: { type: "string", maxLength: 8192 },
  },
  required: ["languageCode", "documentVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a participant-information version with a syntactically checked language-tag-shaped code; registry membership is not checked. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { languageCode, documentVersion } = request;
  const compute = (): Output => {
    H.domain(
      /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*(?![\s\S])/.test(languageCode),
      "languageCode",
    );
    H.domain(documentVersion.length > 0, "documentVersion");
    return {
      label:
        "Participant information " +
        documentVersion +
        " [" +
        languageCode +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { languageCode: "en-GB", documentVersion: "v3" },
  output: { label: "Participant information v3 [en-GB]" },
} satisfies ToolExample<Input, Output>;
export const participantInformationLanguageCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/participant-information-language-code",
    title: "Participant Information Language Code Tool",
    description:
      "Label a participant-information version with a syntactically checked language-tag-shaped code; registry membership is not checked.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        languageCode: { type: "string", maxLength: 8192 },
        documentVersion: { type: "string", maxLength: 8192 },
      },
      required: ["languageCode", "documentVersion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "languageCode",
          label: "Language Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "documentVersion",
          label: "Document Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = participantInformationLanguageCodeTool.execute;
export default participantInformationLanguageCodeTool;
