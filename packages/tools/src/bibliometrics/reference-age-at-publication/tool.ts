import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly citingYear: number;
  readonly citedYear: number;
  readonly suppliedCalendarOffset: number;
};
export type Output = {
  readonly ageYears: number;
  readonly futureReference: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    citingYear: { type: "integer" },
    citedYear: { type: "integer" },
    suppliedCalendarOffset: { type: "integer" },
  },
  required: ["citingYear", "citedYear", "suppliedCalendarOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageYears: { type: "integer" },
    futureReference: { type: "boolean" },
  },
  required: ["ageYears", "futureReference"],
} as const;
/** Compare supplied bibliographic year indices after an explicit cited-source calendar offset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { citingYear, citedYear, suppliedCalendarOffset } = request;
  const compute = (): Output => {
    return {
      ageYears: citingYear - citedYear - suppliedCalendarOffset,
      futureReference: citedYear + suppliedCalendarOffset > citingYear,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { citingYear: 2026, citedYear: 2020, suppliedCalendarOffset: 0 },
  output: { ageYears: 6, futureReference: false },
} satisfies ToolExample<Input, Output>;
export const referenceAgeAtPublicationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/reference-age-at-publication",
    title: "Reference Age At Publication Tool",
    description:
      "Compare supplied bibliographic year indices after an explicit cited-source calendar offset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        citingYear: { type: "integer" },
        citedYear: { type: "integer" },
        suppliedCalendarOffset: { type: "integer" },
      },
      required: ["citingYear", "citedYear", "suppliedCalendarOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageYears: { type: "integer" },
        futureReference: { type: "boolean" },
      },
      required: ["ageYears", "futureReference"],
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
          id: "suppliedCalendarOffset",
          label: "Supplied Calendar Offset",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "ageYears", label: "Age Years", valueType: { type: "integer" } },
        {
          id: "futureReference",
          label: "Future Reference",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = referenceAgeAtPublicationTool.execute;
export default referenceAgeAtPublicationTool;
