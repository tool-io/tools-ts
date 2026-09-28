import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationYear: number;
  readonly sourceYear: number;
  readonly indicator: string;
  readonly source: string;
};
export type Output = {
  readonly ageYears: number;
  readonly futureSource: boolean;
  readonly provenanceKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationYear: { type: "integer" },
    sourceYear: { type: "integer" },
    indicator: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
  },
  required: ["observationYear", "sourceYear", "indicator", "source"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageYears: { type: "integer" },
    futureSource: { type: "boolean" },
    provenanceKey: { type: "string", maxLength: 8192 },
  },
  required: ["ageYears", "futureSource", "provenanceKey"],
} as const;
/** Preserve supplied global-indicator source vintage without fetching or validating indicator data. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationYear, sourceYear, indicator, source } = request;
  const compute = (): Output => {
    return {
      ageYears: observationYear - sourceYear,
      futureSource: sourceYear > observationYear,
      provenanceKey: JSON.stringify([source, indicator, sourceYear]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationYear: 2026,
    sourceYear: 2020,
    indicator: "indicator-A",
    source: "dataset-X",
  },
  output: {
    ageYears: 6,
    futureSource: false,
    provenanceKey: '["dataset-X","indicator-A",2020]',
  },
} satisfies ToolExample<Input, Output>;
export const globalIndicatorVintageAgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "global-studies/global-indicator-vintage-age",
    title: "Global Indicator Vintage Age Tool",
    description:
      "Preserve supplied global-indicator source vintage without fetching or validating indicator data.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationYear: { type: "integer" },
        sourceYear: { type: "integer" },
        indicator: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
      },
      required: ["observationYear", "sourceYear", "indicator", "source"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageYears: { type: "integer" },
        futureSource: { type: "boolean" },
        provenanceKey: { type: "string", maxLength: 8192 },
      },
      required: ["ageYears", "futureSource", "provenanceKey"],
    },
    ports: {
      inputs: [
        {
          id: "observationYear",
          label: "Observation Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceYear",
          label: "Source Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "indicator",
          label: "Indicator",
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
        { id: "ageYears", label: "Age Years", valueType: { type: "integer" } },
        {
          id: "futureSource",
          label: "Future Source",
          valueType: { type: "boolean" },
        },
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
export const run = globalIndicatorVintageAgeTool.execute;
export default globalIndicatorVintageAgeTool;
