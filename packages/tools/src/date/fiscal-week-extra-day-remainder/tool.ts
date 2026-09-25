import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly days: number; readonly weekLength: number };
export type Output = {
  readonly wholeWeeks: number;
  readonly extraDays: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    days: { type: "integer", minimum: 0 },
    weekLength: { type: "integer", minimum: 1 },
  },
  required: ["days", "weekLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholeWeeks: { type: "integer" },
    extraDays: { type: "integer" },
  },
  required: ["wholeWeeks", "extraDays"],
} as const;
/** Calculate fiscal week extra day remainder from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { days, weekLength } = input;
  const compute = (): Output => {
    H.integer(days, 0);
    H.integer(weekLength, 1);
    return {
      wholeWeeks: Math.floor(days / weekLength),
      extraDays: days % weekLength,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { days: 365, weekLength: 7 },
  output: { wholeWeeks: 52, extraDays: 1 },
} satisfies ToolExample<Input, Output>;
export const fiscalWeekExtraDayRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/fiscal-week-extra-day-remainder",
    title: "Fiscal Week Extra Day Remainder Tool",
    description:
      "Calculate fiscal week extra day remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        days: { type: "integer", minimum: 0 },
        weekLength: { type: "integer", minimum: 1 },
      },
      required: ["days", "weekLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholeWeeks: { type: "integer" },
        extraDays: { type: "integer" },
      },
      required: ["wholeWeeks", "extraDays"],
    },
    ports: {
      inputs: [
        {
          id: "days",
          label: "Days",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "weekLength",
          label: "Week Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "wholeWeeks",
          label: "Whole Weeks",
          valueType: { type: "integer" },
        },
        {
          id: "extraDays",
          label: "Extra Days",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = fiscalWeekExtraDayRemainderTool.execute;
export default fiscalWeekExtraDayRemainderTool;
