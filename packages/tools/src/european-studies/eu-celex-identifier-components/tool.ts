import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly identifier: string };
export type Output = {
  readonly sector: number;
  readonly year: number;
  readonly documentType: string;
  readonly documentNumber: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { identifier: { type: "string", maxLength: 8192 } },
  required: ["identifier"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sector: { type: "integer" },
    year: { type: "integer" },
    documentType: { type: "string", maxLength: 8192 },
    documentNumber: { type: "string", maxLength: 8192 },
  },
  required: ["sector", "year", "documentType", "documentNumber"],
} as const;
/** Split a basic CELEX identifier into sector, year, document type and four-digit document number. Consolidated dates, corrigenda and suffix forms are outside this grammar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { identifier } = request;
  const compute = (): Output => {
    const match = /^([0-9])(\d{4})([A-Z]{1,2})(\d{4})(?![\s\S])/.exec(
      identifier,
    );
    H.domain(match, "identifier");
    return {
      sector: Number(match[1]),
      year: Number(match[2]),
      documentType: match[3],
      documentNumber: match[4],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { identifier: "32016R0679" },
  output: { sector: 3, year: 2016, documentType: "R", documentNumber: "0679" },
} satisfies ToolExample<Input, Output>;
export const euCelexIdentifierComponentsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "european-studies/eu-celex-identifier-components",
    title: "Eu Celex Identifier Components Tool",
    description:
      "Split a basic CELEX identifier into sector, year, document type and four-digit document number. Consolidated dates, corrigenda and suffix forms are outside this grammar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { identifier: { type: "string", maxLength: 8192 } },
      required: ["identifier"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sector: { type: "integer" },
        year: { type: "integer" },
        documentType: { type: "string", maxLength: 8192 },
        documentNumber: { type: "string", maxLength: 8192 },
      },
      required: ["sector", "year", "documentType", "documentNumber"],
    },
    ports: {
      inputs: [
        {
          id: "identifier",
          label: "Identifier",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "sector", label: "Sector", valueType: { type: "integer" } },
        { id: "year", label: "Year", valueType: { type: "integer" } },
        {
          id: "documentType",
          label: "Document Type",
          valueType: { type: "string" },
        },
        {
          id: "documentNumber",
          label: "Document Number",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = euCelexIdentifierComponentsTool.execute;
export default euCelexIdentifierComponentsTool;
