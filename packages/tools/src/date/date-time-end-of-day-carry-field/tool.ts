import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
};
export type Output = { readonly hour: number; readonly dayCarry: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hour: { type: "integer", minimum: 0, maximum: 24 },
    minute: { type: "integer", minimum: 0, maximum: 59 },
    second: { type: "integer", minimum: 0, maximum: 59 },
  },
  required: ["hour", "minute", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { hour: { type: "integer" }, dayCarry: { type: "integer" } },
  required: ["hour", "dayCarry"],
} as const;
/** Compute date time end of day carry field from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { hour, minute, second } = input;
  const compute = (): Output => {
    integer(hour, 0, 24);
    integer(minute, 0, 59);
    integer(second, 0, 59);
    domain(hour < 24 || (minute === 0 && second === 0));
    return { hour: hour === 24 ? 0 : hour, dayCarry: hour === 24 ? 1 : 0 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { hour: 24, minute: 0, second: 0 },
  output: { hour: 0, dayCarry: 1 },
} satisfies ToolExample<Input, Output>;
export const dateTimeEndOfDayCarryFieldTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/date-time-end-of-day-carry-field",
  title: "Date Time End Of Day Carry Field Tool",
  description:
    "Compute date time end of day carry field from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "hour",
        label: "Hour",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "minute",
        label: "Minute",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "second",
        label: "Second",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "hour", label: "Hour", valueType: { type: "integer" } },
      { id: "dayCarry", label: "Day Carry", valueType: { type: "integer" } },
    ],
  },
});
export const run = dateTimeEndOfDayCarryFieldTool.execute;
export default dateTimeEndOfDayCarryFieldTool;
