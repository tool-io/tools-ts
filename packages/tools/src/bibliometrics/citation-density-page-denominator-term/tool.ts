import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly citations: number;
  readonly totalPages: number;
  readonly excludedPages: number;
};
export type Output = {
  readonly countedPages: number;
  readonly citationsPerPage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citations: { type: "integer", minimum: 0 },
    totalPages: { type: "integer", minimum: 1 },
    excludedPages: { type: "integer", minimum: 0 },
  },
  required: ["citations", "totalPages", "excludedPages"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    countedPages: { type: "integer" },
    citationsPerPage: { type: "number" },
  },
  required: ["countedPages", "citationsPerPage"],
} as const;
/** Calculate citation density page denominator term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citations, totalPages, excludedPages } = request;
  const compute = (): Output => {
    H.integer(citations, 0);
    H.integer(totalPages, 1);
    H.integer(excludedPages, 0, totalPages - 1);
    return {
      countedPages: totalPages - excludedPages,
      citationsPerPage: citations / (totalPages - excludedPages),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { citations: 30, totalPages: 12, excludedPages: 2 },
  output: { countedPages: 10, citationsPerPage: 3 },
} satisfies ToolExample<Input, Output>;
export const citationDensityPageDenominatorTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/citation-density-page-denominator-term",
    title: "Citation Density Page Denominator Term Tool",
    description:
      "Calculate citation density page denominator term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citations: { type: "integer", minimum: 0 },
        totalPages: { type: "integer", minimum: 1 },
        excludedPages: { type: "integer", minimum: 0 },
      },
      required: ["citations", "totalPages", "excludedPages"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        countedPages: { type: "integer" },
        citationsPerPage: { type: "number" },
      },
      required: ["countedPages", "citationsPerPage"],
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
          id: "totalPages",
          label: "Total Pages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedPages",
          label: "Excluded Pages",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "countedPages",
          label: "Counted Pages",
          valueType: { type: "integer" },
        },
        {
          id: "citationsPerPage",
          label: "Citations Per Page",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = citationDensityPageDenominatorTermTool.execute;
export default citationDensityPageDenominatorTermTool;
