import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestYear: number;
  readonly latestYear: number;
  readonly inclusive: boolean;
};
export type Output = { readonly spanYears: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestYear: { type: "integer" },
    latestYear: { type: "integer" },
    inclusive: { type: "boolean" },
  },
  required: ["earliestYear", "latestYear", "inclusive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { spanYears: { type: "integer" } },
  required: ["spanYears"],
} as const;
/** Measure a supplied public museum object dating envelope without identifying equipment or operational characteristics. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestYear, latestYear, inclusive } = request;
  const compute = (): Output => {
    H.domain(earliestYear <= latestYear);
    return { spanYears: latestYear - earliestYear + (inclusive ? 1 : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliestYear: 1900, latestYear: 1910, inclusive: true },
  output: { spanYears: 11 },
} satisfies ToolExample<Input, Output>;
export const publicMuseumObjectDateWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/public-museum-object-date-width",
    title: "Public Museum Object Date Width Tool",
    description:
      "Measure a supplied public museum object dating envelope without identifying equipment or operational characteristics.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestYear: { type: "integer" },
        latestYear: { type: "integer" },
        inclusive: { type: "boolean" },
      },
      required: ["earliestYear", "latestYear", "inclusive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { spanYears: { type: "integer" } },
      required: ["spanYears"],
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
          id: "inclusive",
          label: "Inclusive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "spanYears",
          label: "Span Years",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = publicMuseumObjectDateWidthTool.execute;
export default publicMuseumObjectDateWidthTool;
