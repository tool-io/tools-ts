import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly commentaryId: string;
  readonly lemmaWording: string;
  readonly sourceLocus: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commentaryId: { type: "string", maxLength: 8192, minLength: 1 },
    lemmaWording: { type: "string", maxLength: 8192, minLength: 1 },
    sourceLocus: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["commentaryId", "lemmaWording", "sourceLocus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a literal commentary lemma and source locus without linguistic interpretation or textual lookup. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { commentaryId, lemmaWording, sourceLocus } = request;
  const compute = (): Output => {
    H.domain(commentaryId.length > 0, "commentaryId");
    H.domain(lemmaWording.length > 0, "lemmaWording");
    H.domain(sourceLocus.length > 0, "sourceLocus");
    return { token: JSON.stringify([commentaryId, lemmaWording, sourceLocus]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    commentaryId: "COM17",
    lemmaWording: "Lemma A",
    sourceLocus: "p. 23",
  },
  output: { token: '["COM17","Lemma A","p. 23"]' },
} satisfies ToolExample<Input, Output>;
export const arabicCommentaryLemmaReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["islamic-studies", "islamic studies", "humanities"],
      keywords: ["islamic studies", "humanities"],
    },
    id: "islamic-studies/arabic-commentary-lemma-reference",
    title: "Arabic Commentary Lemma Reference",
    description:
      "Record a literal commentary lemma and source locus without linguistic interpretation or textual lookup.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commentaryId: { type: "string", maxLength: 8192, minLength: 1 },
        lemmaWording: { type: "string", maxLength: 8192, minLength: 1 },
        sourceLocus: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["commentaryId", "lemmaWording", "sourceLocus"],
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
          id: "commentaryId",
          label: "Commentary Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lemmaWording",
          label: "Lemma Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceLocus",
          label: "Source Locus",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = arabicCommentaryLemmaReferenceTool.execute;
export default arabicCommentaryLemmaReferenceTool;
