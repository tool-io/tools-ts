import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationYear: number;
  readonly sourceYear: number;
};
export type Output = {
  readonly ageYears: number;
  readonly futureSource: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationYear: { type: "integer" },
    sourceYear: { type: "integer" },
  },
  required: ["observationYear", "sourceYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ageYears: { type: "integer" },
    futureSource: { type: "boolean" },
  },
  required: ["ageYears", "futureSource"],
} as const;
/** Compare supplied toponym source vintage metadata without asserting a preferred name or jurisdiction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationYear, sourceYear } = request;
  const compute = (): Output => {
    return {
      ageYears: observationYear - sourceYear,
      futureSource: sourceYear > observationYear,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationYear: 2026, sourceYear: 1980 },
  output: { ageYears: 46, futureSource: false },
} satisfies ToolExample<Input, Output>;
export const toponymSourceVintageAgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "african-studies/toponym-source-vintage-age",
    title: "Toponym Source Vintage Age Tool",
    description:
      "Compare supplied toponym source vintage metadata without asserting a preferred name or jurisdiction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationYear: { type: "integer" },
        sourceYear: { type: "integer" },
      },
      required: ["observationYear", "sourceYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ageYears: { type: "integer" },
        futureSource: { type: "boolean" },
      },
      required: ["ageYears", "futureSource"],
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
      ],
      outputs: [
        { id: "ageYears", label: "Age Years", valueType: { type: "integer" } },
        {
          id: "futureSource",
          label: "Future Source",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = toponymSourceVintageAgeTool.execute;
export default toponymSourceVintageAgeTool;
