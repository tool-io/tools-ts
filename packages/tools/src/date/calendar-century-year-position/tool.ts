import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly year: number };
export type Output = { readonly century: number; readonly position: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { year: { type: "integer", minimum: 1, maximum: 9999 } },
  required: ["year"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { century: { type: "integer" }, position: { type: "integer" } },
  required: ["century", "position"],
} as const;
/** Compute calendar century year position from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { year } = input;
  const compute = (): Output => {
    integer(year, 1, 9999);
    return {
      century: Math.floor((year - 1) / 100) + 1,
      position: ((year - 1) % 100) + 1,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { year: 2000 },
  output: { century: 20, position: 100 },
} satisfies ToolExample<Input, Output>;
export const calendarCenturyYearPositionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/calendar-century-year-position",
  title: "Calendar Century Year Position Tool",
  description:
    "Compute calendar century year position from explicit bounded inputs.",
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
    ],
    outputs: [
      { id: "century", label: "Century", valueType: { type: "integer" } },
      { id: "position", label: "Position", valueType: { type: "integer" } },
    ],
  },
});
export const run = calendarCenturyYearPositionTool.execute;
export default calendarCenturyYearPositionTool;
