import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceCode: string;
  readonly languageCode: string;
  readonly codeAuthority: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceCode: { type: "string", maxLength: 8192, minLength: 1 },
    languageCode: { type: "string", maxLength: 8192, minLength: 1 },
    codeAuthority: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceCode", "languageCode", "codeAuthority"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Attach a literal language code and its authority to a source without language detection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceCode, languageCode, codeAuthority } = request;
  const compute = (): Output => {
    H.domain(sourceCode.length > 0, "sourceCode");
    H.domain(languageCode.length > 0, "languageCode");
    H.domain(codeAuthority.length > 0, "codeAuthority");
    return { token: JSON.stringify([sourceCode, languageCode, codeAuthority]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceCode: "SRC17",
    languageCode: "en",
    codeAuthority: "Codebook A",
  },
  output: { token: '["SRC17","en","Codebook A"]' },
} satisfies ToolExample<Input, Output>;
export const internationalSourceLanguageTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["global-studies", "global studies", "social sciences"],
      keywords: ["global studies", "social sciences"],
    },
    id: "global-studies/international-source-language-tag",
    title: "International Source Language Tag",
    description:
      "Attach a literal language code and its authority to a source without language detection.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceCode: { type: "string", maxLength: 8192, minLength: 1 },
        languageCode: { type: "string", maxLength: 8192, minLength: 1 },
        codeAuthority: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceCode", "languageCode", "codeAuthority"],
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
          id: "sourceCode",
          label: "Source Code",
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
          id: "codeAuthority",
          label: "Code Authority",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = internationalSourceLanguageTagTool.execute;
export default internationalSourceLanguageTagTool;
