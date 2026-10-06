import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly documentId: string;
  readonly genreCode: string;
  readonly codebookVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    documentId: { type: "string", maxLength: 8192, minLength: 1 },
    genreCode: { type: "string", maxLength: 8192, minLength: 1 },
    codebookVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["documentId", "genreCode", "codebookVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode a caller-assigned corpus genre annotation with its codebook version without classifying a document automatically. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { documentId, genreCode, codebookVersion } = request;
  const compute = (): Output => {
    H.domain(
      documentId.length > 0 &&
        genreCode.length > 0 &&
        codebookVersion.length > 0,
      "documentId",
    );
    return { token: JSON.stringify([documentId, genreCode, codebookVersion]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { documentId: "D17", genreCode: "news", codebookVersion: "v2" },
  output: { token: '["D17","news","v2"]' },
} satisfies ToolExample<Input, Output>;
export const areaStudyCorpusGenreCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["area-studies", "area studies", "humanities"],
      keywords: ["area studies", "humanities"],
    },
    id: "area-studies/area-study-corpus-genre-code",
    title: "Area Study Corpus Genre Code",
    description:
      "Encode a caller-assigned corpus genre annotation with its codebook version without classifying a document automatically.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        documentId: { type: "string", maxLength: 8192, minLength: 1 },
        genreCode: { type: "string", maxLength: 8192, minLength: 1 },
        codebookVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["documentId", "genreCode", "codebookVersion"],
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
          id: "documentId",
          label: "Document Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "genreCode",
          label: "Genre Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "codebookVersion",
          label: "Codebook Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = areaStudyCorpusGenreCodeTool.execute;
export default areaStudyCorpusGenreCodeTool;
