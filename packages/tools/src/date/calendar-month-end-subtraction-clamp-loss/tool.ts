import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly sourceDay: number;
  readonly targetMonthDays: number;
};
export type Output = { readonly targetDay: number; readonly lostDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceDay: { type: "integer", minimum: 1, maximum: 31 },
    targetMonthDays: { type: "integer", minimum: 28, maximum: 31 },
  },
  required: ["sourceDay", "targetMonthDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetDay: { type: "integer" }, lostDays: { type: "integer" } },
  required: ["targetDay", "lostDays"],
} as const;
/** Compute calendar month end subtraction clamp loss from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { sourceDay, targetMonthDays } = input;
  const compute = (): Output => {
    integer(sourceDay, 1, 31);
    integer(targetMonthDays, 28, 31);
    return {
      targetDay: Math.min(sourceDay, targetMonthDays),
      lostDays: Math.max(0, sourceDay - targetMonthDays),
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { sourceDay: 31, targetMonthDays: 28 },
  output: { targetDay: 28, lostDays: 3 },
} satisfies ToolExample<Input, Output>;
export const calendarMonthEndSubtractionClampLossTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/calendar-month-end-subtraction-clamp-loss",
  title: "Calendar Month End Subtraction Clamp Loss Tool",
  description:
    "Compute calendar month end subtraction clamp loss from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "sourceDay",
        label: "Source Day",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "targetMonthDays",
        label: "Target Month Days",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "targetDay", label: "Target Day", valueType: { type: "integer" } },
      { id: "lostDays", label: "Lost Days", valueType: { type: "integer" } },
    ],
  },
});
export const run = calendarMonthEndSubtractionClampLossTool.execute;
export default calendarMonthEndSubtractionClampLossTool;
