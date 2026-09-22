import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly regionLabel: string;
  readonly source: string;
  readonly sourceYear: number;
  readonly observationYear: number;
};
export type Output = { readonly ageYears: number; readonly sourceKey: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    regionLabel: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    sourceYear: { type: "integer" },
    observationYear: { type: "integer" },
  },
  required: ["regionLabel", "source", "sourceYear", "observationYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageYears: { type: "integer" },
    sourceKey: { type: "string", maxLength: 8192 },
  },
  required: ["ageYears", "sourceKey"],
} as const;
/** Preserve supplied regional label/source vintage metadata without imposing a regional classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { regionLabel, source, sourceYear, observationYear } = request;
  const compute = (): Output => {
    return {
      ageYears: observationYear - sourceYear,
      sourceKey: JSON.stringify([source, sourceYear, regionLabel]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    regionLabel: "region-A",
    source: "atlas-2",
    sourceYear: 1980,
    observationYear: 2026,
  },
  output: { ageYears: 46, sourceKey: '["atlas-2",1980,"region-A"]' },
} satisfies ToolExample<Input, Output>;
export const regionLabelSourceVintageTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "area-studies/region-label-source-vintage",
    title: "Region Label Source Vintage Tool",
    description:
      "Preserve supplied regional label/source vintage metadata without imposing a regional classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        regionLabel: { type: "string", maxLength: 8192 },
        source: { type: "string", maxLength: 8192 },
        sourceYear: { type: "integer" },
        observationYear: { type: "integer" },
      },
      required: ["regionLabel", "source", "sourceYear", "observationYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageYears: { type: "integer" },
        sourceKey: { type: "string", maxLength: 8192 },
      },
      required: ["ageYears", "sourceKey"],
    },
    ports: {
      inputs: [
        {
          id: "regionLabel",
          label: "Region Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "source",
          label: "Source",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceYear",
          label: "Source Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observationYear",
          label: "Observation Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ageYears", label: "Age Years", valueType: { type: "integer" } },
        { id: "sourceKey", label: "Source Key", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = regionLabelSourceVintageTool.execute;
export default regionLabelSourceVintageTool;
