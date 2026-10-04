import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publicationId: string;
  readonly languageTag: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicationId: { type: "string", maxLength: 8192 },
    languageTag: { type: "string", maxLength: 8192 },
  },
  required: ["publicationId", "languageTag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach a syntactically checked caller-supplied language tag to a publication record, without inferring language from region. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { publicationId, languageTag } = request;
  const compute = (): Output => {
    H.domain(publicationId.length > 0, "publicationId");
    H.domain(
      /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*(?![\s\S])/.test(languageTag),
      "languageTag",
    );
    return { label: publicationId + " [language=" + languageTag + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { publicationId: "PUB17", languageTag: "sw" },
  output: { label: "PUB17 [language=sw]" },
} satisfies ToolExample<Input, Output>;
export const africanPublicationLanguageTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/african-publication-language-tag",
    title: "African Publication Language Tag Tool",
    description:
      "Attach a syntactically checked caller-supplied language tag to a publication record, without inferring language from region.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        publicationId: { type: "string", maxLength: 8192 },
        languageTag: { type: "string", maxLength: 8192 },
      },
      required: ["publicationId", "languageTag"],
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
          id: "publicationId",
          label: "Publication Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "languageTag",
          label: "Language Tag",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = africanPublicationLanguageTagTool.execute;
export default africanPublicationLanguageTagTool;
