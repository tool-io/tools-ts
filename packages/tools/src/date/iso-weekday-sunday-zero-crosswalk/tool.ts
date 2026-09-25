import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly day: number; readonly fromIso: boolean };
export type Output = { readonly day: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { day: { type: "integer" }, fromIso: { type: "boolean" } },
  required: ["day", "fromIso"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { day: { type: "integer" } },
  required: ["day"],
} as const;
/** Compute iso weekday sunday zero crosswalk from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { day, fromIso } = input;
  const compute = (): Output => {
    integer(day, fromIso ? 1 : 0, fromIso ? 7 : 6);
    return { day: fromIso ? day % 7 : day === 0 ? 7 : day };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { day: 7, fromIso: true },
  output: { day: 0 },
} satisfies ToolExample<Input, Output>;
export const isoWeekdaySundayZeroCrosswalkTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/iso-weekday-sunday-zero-crosswalk",
  title: "ISO Weekday Sunday Zero Crosswalk Tool",
  description:
    "Compute iso weekday sunday zero crosswalk from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "day",
        label: "Day",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "fromIso",
        label: "From Iso",
        required: true,
        valueType: { type: "boolean" },
      },
    ],
    outputs: [{ id: "day", label: "Day", valueType: { type: "integer" } }],
  },
});
export const run = isoWeekdaySundayZeroCrosswalkTool.execute;
export default isoWeekdaySundayZeroCrosswalkTool;
