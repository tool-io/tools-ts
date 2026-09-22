import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestYear: number;
  readonly latestYear: number;
  readonly countEndpoints: boolean;
};
export type Output = { readonly widthYears: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestYear: { type: "integer" },
    latestYear: { type: "integer" },
    countEndpoints: { type: "boolean" },
  },
  required: ["earliestYear", "latestYear", "countEndpoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { widthYears: { type: "integer" } },
  required: ["widthYears"],
} as const;
/** Measure a caller-supplied historical date envelope without dating or authenticating an artwork. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestYear, latestYear, countEndpoints } = request;
  const compute = (): Output => {
    H.domain(earliestYear <= latestYear);
    return { widthYears: latestYear - earliestYear + (countEndpoints ? 1 : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliestYear: 1850, latestYear: 1860, countEndpoints: false },
  output: { widthYears: 10 },
} satisfies ToolExample<Input, Output>;
export const artworkDateIntervalWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/artwork-date-interval-width",
    title: "Artwork Date Interval Width Tool",
    description:
      "Measure a caller-supplied historical date envelope without dating or authenticating an artwork.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestYear: { type: "integer" },
        latestYear: { type: "integer" },
        countEndpoints: { type: "boolean" },
      },
      required: ["earliestYear", "latestYear", "countEndpoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { widthYears: { type: "integer" } },
      required: ["widthYears"],
    },
    ports: {
      inputs: [
        {
          id: "earliestYear",
          label: "Earliest Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "latestYear",
          label: "Latest Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countEndpoints",
          label: "Count Endpoints",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "widthYears",
          label: "Width Years",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = artworkDateIntervalWidthTool.execute;
export default artworkDateIntervalWidthTool;
