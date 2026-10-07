import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preprintId: string;
  readonly journalArticleId: string;
  readonly linkSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preprintId: { type: "string", maxLength: 8192, minLength: 1 },
    journalArticleId: { type: "string", maxLength: 8192, minLength: 1 },
    linkSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["preprintId", "journalArticleId", "linkSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit preprint-to-journal linkage and source without asserting content equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preprintId, journalArticleId, linkSource } = request;
  const compute = (): Output => {
    H.domain(preprintId.length > 0, "preprintId");
    H.domain(journalArticleId.length > 0, "journalArticleId");
    H.domain(linkSource.length > 0, "linkSource");
    return {
      token: JSON.stringify([preprintId, journalArticleId, linkSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preprintId: "P17",
    journalArticleId: "J4",
    linkSource: "author record",
  },
  output: { token: '["P17","J4","author record"]' },
} satisfies ToolExample<Input, Output>;
export const publicationPreprintJournalLinkTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/publication-preprint-journal-link-tag",
    title: "Publication Preprint Journal Link Tag",
    description:
      "Record an explicit preprint-to-journal linkage and source without asserting content equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preprintId: { type: "string", maxLength: 8192, minLength: 1 },
        journalArticleId: { type: "string", maxLength: 8192, minLength: 1 },
        linkSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["preprintId", "journalArticleId", "linkSource"],
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
          id: "preprintId",
          label: "Preprint Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "journalArticleId",
          label: "Journal Article Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "linkSource",
          label: "Link Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = publicationPreprintJournalLinkTagTool.execute;
export default publicationPreprintJournalLinkTagTool;
