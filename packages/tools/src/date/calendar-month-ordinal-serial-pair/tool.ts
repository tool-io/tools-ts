import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly year: number; readonly month: number };
export type Output = { readonly serial: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer" },
    month: { type: "integer", minimum: 1, maximum: 12 },
  },
  required: ["year", "month"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { serial: { type: "integer" } },
  required: ["serial"],
} as const;
/** Calculate calendar month ordinal serial pair from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { year, month } = input;
  const compute = (): Output => {
    H.integer(month, 1, 12);
    return { serial: year * 12 + month - 1 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { year: 2026, month: 10 },
  output: { serial: 24321 },
} satisfies ToolExample<Input, Output>;
export const calendarMonthOrdinalSerialPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/calendar-month-ordinal-serial-pair",
    title: "Calendar Month Ordinal Serial Pair Tool",
    description:
      "Calculate calendar month ordinal serial pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        year: { type: "integer" },
        month: { type: "integer", minimum: 1, maximum: 12 },
      },
      required: ["year", "month"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { serial: { type: "integer" } },
      required: ["serial"],
    },
    ports: {
      inputs: [
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "month",
          label: "Month",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "serial", label: "Serial", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = calendarMonthOrdinalSerialPairTool.execute;
export default calendarMonthOrdinalSerialPairTool;
