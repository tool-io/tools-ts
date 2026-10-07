import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rankText: string;
  readonly abbreviationText: string;
  readonly source: string;
};
export type Output = { readonly key: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rankText: { type: "string", maxLength: 8192, minLength: 1 },
    abbreviationText: { type: "string", maxLength: 8192, minLength: 1 },
    source: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["rankText", "abbreviationText", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { key: { type: "string", maxLength: 8192 } },
  required: ["key"],
} as const;
/** Record an explicitly supplied taxonomic-rank abbreviation and source without applying a nomenclatural code. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rankText, abbreviationText, source } = request;
  const compute = (): Output => {
    H.domain(
      rankText.length > 0 && abbreviationText.length > 0 && source.length > 0,
      "rankText",
    );
    return { key: JSON.stringify([rankText, abbreviationText, source]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    rankText: "subspecies",
    abbreviationText: "subsp.",
    source: "Catalogue A",
  },
  output: { key: '["subspecies","subsp.","Catalogue A"]' },
} satisfies ToolExample<Input, Output>;
export const taxonomicRankAbbreviationKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biosystematics", "biology"],
      keywords: ["biosystematics", "biology"],
    },
    id: "biosystematics/taxonomic-rank-abbreviation-key",
    title: "Taxonomic Rank Abbreviation Key",
    description:
      "Record an explicitly supplied taxonomic-rank abbreviation and source without applying a nomenclatural code.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rankText: { type: "string", maxLength: 8192, minLength: 1 },
        abbreviationText: { type: "string", maxLength: 8192, minLength: 1 },
        source: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["rankText", "abbreviationText", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { key: { type: "string", maxLength: 8192 } },
      required: ["key"],
    },
    ports: {
      inputs: [
        {
          id: "rankText",
          label: "Rank Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "abbreviationText",
          label: "Abbreviation Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "key", label: "Key", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = taxonomicRankAbbreviationKeyTool.execute;
export default taxonomicRankAbbreviationKeyTool;
