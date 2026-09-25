import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly year: number; readonly ordinal: number };
export type Output = { readonly date: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    year: { type: "integer", minimum: 1, maximum: 9999 },
    ordinal: { type: "integer", minimum: 1, maximum: 366 },
  },
  required: ["year", "ordinal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { date: { type: "string", maxLength: 8192 } },
  required: ["date"],
} as const;
/** Compute ordinal day leap boundary crosswalk from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { year, ordinal } = input;
  const compute = (): Output => {
    integer(year, 1, 9999);
    integer(ordinal, 1, 366);
    const date = new Date(0);
    date.setUTCFullYear(year, 0, ordinal);
    date.setUTCHours(0, 0, 0, 0);
    domain(date.getUTCFullYear() === year);
    return { date: date.toISOString().slice(0, 10) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { year: 2024, ordinal: 60 },
  output: { date: "2024-02-29" },
} satisfies ToolExample<Input, Output>;
export const ordinalDayLeapBoundaryCrosswalkTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/ordinal-day-leap-boundary-crosswalk",
  title: "Ordinal Day Leap Boundary Crosswalk Tool",
  description:
    "Compute ordinal day leap boundary crosswalk from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "year",
        label: "Year",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "ordinal",
        label: "Ordinal",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [{ id: "date", label: "Date", valueType: { type: "string" } }],
  },
});
export const run = ordinalDayLeapBoundaryCrosswalkTool.execute;
export default ordinalDayLeapBoundaryCrosswalkTool;
