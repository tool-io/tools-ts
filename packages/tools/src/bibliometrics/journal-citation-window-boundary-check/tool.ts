import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly citingYear: number;
  readonly citedYear: number;
  readonly earliestLag: number;
  readonly latestLag: number;
};
export type Output = { readonly lag: number; readonly included: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citingYear: { type: "integer" },
    citedYear: { type: "integer" },
    earliestLag: { type: "integer", minimum: 0 },
    latestLag: { type: "integer" },
  },
  required: ["citingYear", "citedYear", "earliestLag", "latestLag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lag: { type: "integer" }, included: { type: "boolean" } },
  required: ["lag", "included"],
} as const;
/** Inclusive cited-publication-year lag window; no journal indicator policy is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citingYear, citedYear, earliestLag, latestLag } = request;
  const compute = (): Output => {
    H.integer(earliestLag, 0);
    H.integer(latestLag, earliestLag);
    return {
      lag: citingYear - citedYear,
      included:
        citingYear - citedYear >= earliestLag &&
        citingYear - citedYear <= latestLag,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { citingYear: 2026, citedYear: 2024, earliestLag: 1, latestLag: 2 },
  output: { lag: 2, included: true },
} satisfies ToolExample<Input, Output>;
export const journalCitationWindowBoundaryCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/journal-citation-window-boundary-check",
    title: "Journal Citation Window Boundary Check Tool",
    description:
      "Inclusive cited-publication-year lag window; no journal indicator policy is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citingYear: { type: "integer" },
        citedYear: { type: "integer" },
        earliestLag: { type: "integer", minimum: 0 },
        latestLag: { type: "integer" },
      },
      required: ["citingYear", "citedYear", "earliestLag", "latestLag"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lag: { type: "integer" }, included: { type: "boolean" } },
      required: ["lag", "included"],
    },
    ports: {
      inputs: [
        {
          id: "citingYear",
          label: "Citing Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "citedYear",
          label: "Cited Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "earliestLag",
          label: "Earliest Lag",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "latestLag",
          label: "Latest Lag",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "lag", label: "Lag", valueType: { type: "integer" } },
        { id: "included", label: "Included", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = journalCitationWindowBoundaryCheckTool.execute;
export default journalCitationWindowBoundaryCheckTool;
