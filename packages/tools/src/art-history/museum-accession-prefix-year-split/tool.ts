import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly accession: string };
export type Output = {
  readonly prefix: string;
  readonly year: number;
  readonly sequence: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { accession: { type: "string", maxLength: 8192 } },
  required: ["accession"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefix: { type: "string", maxLength: 8192 },
    year: { type: "integer" },
    sequence: { type: "string", maxLength: 8192 },
  },
  required: ["prefix", "year", "sequence"],
} as const;
/** Split an explicitly supported PREFIX-YYYY-SEQUENCE museum accession convention while preserving sequence padding. No universal museum format is assumed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { accession } = request;
  const compute = (): Output => {
    const match = /^([A-Za-z][A-Za-z0-9]*)-(\d{4})-(\d+)(?![\s\S])/.exec(
      accession,
    );
    H.domain(match, "accession");
    return { prefix: match[1], year: Number(match[2]), sequence: match[3] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { accession: "MUS-2026-0017" },
  output: { prefix: "MUS", year: 2026, sequence: "0017" },
} satisfies ToolExample<Input, Output>;
export const museumAccessionPrefixYearSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/museum-accession-prefix-year-split",
    title: "Museum Accession Prefix Year Split Tool",
    description:
      "Split an explicitly supported PREFIX-YYYY-SEQUENCE museum accession convention while preserving sequence padding. No universal museum format is assumed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { accession: { type: "string", maxLength: 8192 } },
      required: ["accession"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefix: { type: "string", maxLength: 8192 },
        year: { type: "integer" },
        sequence: { type: "string", maxLength: 8192 },
      },
      required: ["prefix", "year", "sequence"],
    },
    ports: {
      inputs: [
        {
          id: "accession",
          label: "Accession",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "prefix", label: "Prefix", valueType: { type: "string" } },
        { id: "year", label: "Year", valueType: { type: "integer" } },
        { id: "sequence", label: "Sequence", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = museumAccessionPrefixYearSplitTool.execute;
export default museumAccessionPrefixYearSplitTool;
