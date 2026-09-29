import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labelDifference: number;
  readonly omittedDays: number;
  readonly repeatedDays: number;
};
export type Output = { readonly elapsedDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelDifference: { type: "integer" },
    omittedDays: { type: "integer", minimum: 0 },
    repeatedDays: { type: "integer", minimum: 0 },
  },
  required: ["labelDifference", "omittedDays", "repeatedDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsedDays: { type: "integer" } },
  required: ["elapsedDays"],
} as const;
/** Correct a supplied calendar-label difference using explicit omitted/repeated-day counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labelDifference, omittedDays, repeatedDays } = request;
  const compute = (): Output => {
    H.integer(omittedDays, 0);
    H.integer(repeatedDays, 0);
    return { elapsedDays: labelDifference - omittedDays + repeatedDays };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { labelDifference: 20, omittedDays: 11, repeatedDays: 0 },
  output: { elapsedDays: 9 },
} satisfies ToolExample<Input, Output>;
export const calendarGapDurationCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/calendar-gap-duration-correction",
    title: "Calendar Gap Duration Correction Tool",
    description:
      "Correct a supplied calendar-label difference using explicit omitted/repeated-day counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelDifference: { type: "integer" },
        omittedDays: { type: "integer", minimum: 0 },
        repeatedDays: { type: "integer", minimum: 0 },
      },
      required: ["labelDifference", "omittedDays", "repeatedDays"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elapsedDays: { type: "integer" } },
      required: ["elapsedDays"],
    },
    ports: {
      inputs: [
        {
          id: "labelDifference",
          label: "Label Difference",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "omittedDays",
          label: "Omitted Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "repeatedDays",
          label: "Repeated Days",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "elapsedDays",
          label: "Elapsed Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = calendarGapDurationCorrectionTool.execute;
export default calendarGapDurationCorrectionTool;
