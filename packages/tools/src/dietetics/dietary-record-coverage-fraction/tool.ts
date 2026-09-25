import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedDays: number;
  readonly expectedDays: number;
  readonly excludedDays: number;
};
export type Output = {
  readonly denominatorDays: number;
  readonly fraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedDays: { type: "integer", minimum: 0 },
    expectedDays: { type: "integer", minimum: 0 },
    excludedDays: { type: "integer", minimum: 0 },
  },
  required: ["recordedDays", "expectedDays", "excludedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominatorDays: { type: "integer" },
    fraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominatorDays", "fraction", "defined"],
} as const;
/** Audit supplied record-day completion without inferring dietary intake. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedDays, expectedDays, excludedDays } = request;
  const compute = (): Output => {
    H.integer(expectedDays, 0);
    H.integer(excludedDays, 0, expectedDays);
    H.integer(recordedDays, 0, expectedDays - excludedDays);
    return {
      denominatorDays: expectedDays - excludedDays,
      fraction:
        expectedDays > excludedDays
          ? recordedDays / (expectedDays - excludedDays)
          : 0,
      defined: expectedDays > excludedDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedDays: 5, expectedDays: 7, excludedDays: 1 },
  output: { denominatorDays: 6, fraction: 0.8333333333333334, defined: true },
} satisfies ToolExample<Input, Output>;
export const dietaryRecordCoverageFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/dietary-record-coverage-fraction",
    title: "Dietary Record Coverage Fraction Tool",
    description:
      "Audit supplied record-day completion without inferring dietary intake.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedDays: { type: "integer", minimum: 0 },
        expectedDays: { type: "integer", minimum: 0 },
        excludedDays: { type: "integer", minimum: 0 },
      },
      required: ["recordedDays", "expectedDays", "excludedDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominatorDays: { type: "integer" },
        fraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominatorDays", "fraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "recordedDays",
          label: "Recorded Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expectedDays",
          label: "Expected Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excludedDays",
          label: "Excluded Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "denominatorDays",
          label: "Denominator Days",
          valueType: { type: "integer" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = dietaryRecordCoverageFractionTool.execute;
export default dietaryRecordCoverageFractionTool;
