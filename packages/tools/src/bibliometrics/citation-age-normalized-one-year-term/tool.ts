import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly citations: number;
  readonly publicationYear: number;
  readonly censusYear: number;
  readonly includePublicationYear: boolean;
};
export type Output = {
  readonly exposureYears: number;
  readonly citationsPerYear: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citations: { type: "integer", minimum: 0 },
    publicationYear: { type: "integer" },
    censusYear: { type: "integer" },
    includePublicationYear: { type: "boolean" },
  },
  required: [
    "citations",
    "publicationYear",
    "censusYear",
    "includePublicationYear",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposureYears: { type: "integer" },
    citationsPerYear: { type: "number" },
  },
  required: ["exposureYears", "citationsPerYear"],
} as const;
/** Calculate citation age normalized one year term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citations, publicationYear, censusYear, includePublicationYear } =
    request;
  const compute = (): Output => {
    H.integer(citations, 0);
    H.domain(
      censusYear - publicationYear + (includePublicationYear ? 1 : 0) > 0,
    );
    return {
      exposureYears:
        censusYear - publicationYear + (includePublicationYear ? 1 : 0),
      citationsPerYear:
        citations /
        (censusYear - publicationYear + (includePublicationYear ? 1 : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    citations: 20,
    publicationYear: 2020,
    censusYear: 2025,
    includePublicationYear: false,
  },
  output: { exposureYears: 5, citationsPerYear: 4 },
} satisfies ToolExample<Input, Output>;
export const citationAgeNormalizedOneYearTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/citation-age-normalized-one-year-term",
    title: "Citation Age Normalized One Year Term Tool",
    description:
      "Calculate citation age normalized one year term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citations: { type: "integer", minimum: 0 },
        publicationYear: { type: "integer" },
        censusYear: { type: "integer" },
        includePublicationYear: { type: "boolean" },
      },
      required: [
        "citations",
        "publicationYear",
        "censusYear",
        "includePublicationYear",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposureYears: { type: "integer" },
        citationsPerYear: { type: "number" },
      },
      required: ["exposureYears", "citationsPerYear"],
    },
    ports: {
      inputs: [
        {
          id: "citations",
          label: "Citations",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "publicationYear",
          label: "Publication Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "censusYear",
          label: "Census Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includePublicationYear",
          label: "Include Publication Year",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "exposureYears",
          label: "Exposure Years",
          valueType: { type: "integer" },
        },
        {
          id: "citationsPerYear",
          label: "Citations Per Year",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = citationAgeNormalizedOneYearTermTool.execute;
export default citationAgeNormalizedOneYearTermTool;
