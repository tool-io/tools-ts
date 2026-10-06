import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly publicationId: string;
  readonly suppliedScript: string;
  readonly suppliedLanguage: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    publicationId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedScript: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedLanguage: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["publicationId", "suppliedScript", "suppliedLanguage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit publication script-language pair without detecting language from text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { publicationId, suppliedScript, suppliedLanguage } = request;
  const compute = (): Output => {
    H.domain(publicationId.length > 0, "publicationId");
    H.domain(suppliedScript.length > 0, "suppliedScript");
    H.domain(suppliedLanguage.length > 0, "suppliedLanguage");
    return {
      token: JSON.stringify([publicationId, suppliedScript, suppliedLanguage]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    publicationId: "PUB17",
    suppliedScript: "Script A",
    suppliedLanguage: "Language B",
  },
  output: { token: '["PUB17","Script A","Language B"]' },
} satisfies ToolExample<Input, Output>;
export const asianPublicationScriptLanguagePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["asian-studies", "asian studies", "humanities"],
      keywords: ["asian studies", "humanities"],
    },
    id: "asian-studies/asian-publication-script-language-pair",
    title: "Asian Publication Script Language Pair",
    description:
      "Preserve an explicit publication script-language pair without detecting language from text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        publicationId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedScript: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedLanguage: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["publicationId", "suppliedScript", "suppliedLanguage"],
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
          id: "publicationId",
          label: "Publication Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedScript",
          label: "Supplied Script",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedLanguage",
          label: "Supplied Language",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = asianPublicationScriptLanguagePairTool.execute;
export default asianPublicationScriptLanguagePairTool;
