import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly yearToken: string;
  readonly authority: string;
  readonly source: string;
};
export type Output = { readonly year: number; readonly provenanceKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    yearToken: { type: "string", maxLength: 8192 },
    authority: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["yearToken", "authority", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer" },
    provenanceKey: { type: "string", maxLength: 8192 },
  },
  required: ["year", "provenanceKey"],
} as const;
/** Inspect one supplied four-digit taxon-authority bibliographic year token without nomenclatural validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { yearToken, authority, source } = request;
  const compute = (): Output => {
    H.domain(/^\d{4}(?![\s\S])/.test(yearToken), "yearToken");
    return {
      year: Number(yearToken),
      provenanceKey: JSON.stringify([source, authority, yearToken]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { yearToken: "1900", authority: "Author A", source: "source-2" },
  output: { year: 1900, provenanceKey: '["source-2","Author A","1900"]' },
} satisfies ToolExample<Input, Output>;
export const taxonAuthorityYearTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosystematics/taxon-authority-year-token",
    title: "Taxon Authority Year Token Tool",
    description:
      "Inspect one supplied four-digit taxon-authority bibliographic year token without nomenclatural validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yearToken: { type: "string", maxLength: 8192 },
        authority: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["yearToken", "authority", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer" },
        provenanceKey: { type: "string", maxLength: 8192 },
      },
      required: ["year", "provenanceKey"],
    },
    ports: {
      inputs: [
        {
          id: "yearToken",
          label: "Year Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "authority",
          label: "Authority",
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
      outputs: [
        { id: "year", label: "Year", valueType: { type: "integer" } },
        {
          id: "provenanceKey",
          label: "Provenance Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonAuthorityYearTokenTool.execute;
export default taxonAuthorityYearTokenTool;
