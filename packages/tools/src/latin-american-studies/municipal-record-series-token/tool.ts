import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly municipality: string;
  readonly series: string;
  readonly repository: string;
};
export type Output = { readonly qualifiedSeries: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    municipality: { type: "string", maxLength: 8192 },
    series: { type: "string", maxLength: 8192 },
    repository: { type: "string", maxLength: 8192 },
  },
  required: ["municipality", "series", "repository"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { qualifiedSeries: { type: "string", maxLength: 8192 } },
  required: ["qualifiedSeries"],
} as const;
/** Qualify an explicitly supplied municipal archive series without assuming administrative equivalence across sources. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { municipality, series, repository } = request;
  const compute = (): Output => {
    return {
      qualifiedSeries: JSON.stringify([repository, municipality, series]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    municipality: "municipality-A",
    series: "series-7",
    repository: "archive-X",
  },
  output: { qualifiedSeries: '["archive-X","municipality-A","series-7"]' },
} satisfies ToolExample<Input, Output>;
export const municipalRecordSeriesTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "latin-american-studies/municipal-record-series-token",
    title: "Municipal Record Series Token Tool",
    description:
      "Qualify an explicitly supplied municipal archive series without assuming administrative equivalence across sources.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        municipality: { type: "string", maxLength: 8192 },
        series: { type: "string", maxLength: 8192 },
        repository: { type: "string", maxLength: 8192 },
      },
      required: ["municipality", "series", "repository"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { qualifiedSeries: { type: "string", maxLength: 8192 } },
      required: ["qualifiedSeries"],
    },
    ports: {
      inputs: [
        {
          id: "municipality",
          label: "Municipality",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "series",
          label: "Series",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "repository",
          label: "Repository",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "qualifiedSeries",
          label: "Qualified Series",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = municipalRecordSeriesTokenTool.execute;
export default municipalRecordSeriesTokenTool;
