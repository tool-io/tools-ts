import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly weekday: number; readonly dayOffset: number };
export type Output = { readonly weekday: number; readonly weekCarry: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weekday: { type: "integer", minimum: 1, maximum: 7 },
    dayOffset: { type: "integer" },
  },
  required: ["weekday", "dayOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weekday: { type: "integer" }, weekCarry: { type: "integer" } },
  required: ["weekday", "weekCarry"],
} as const;
/** Calculate iso weekday cycle offset from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weekday, dayOffset } = request;
  const compute = (): Output => {
    H.integer(weekday, 1, 7);
    const n = BigInt(weekday - 1) + BigInt(dayOffset);
    let q = n / 7n,
      r = n % 7n;
    if (r < 0n) {
      q--;
      r += 7n;
    }
    return { weekday: Number(r) + 1, weekCarry: Number(q) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weekday: 7, dayOffset: 2 },
  output: { weekday: 2, weekCarry: 1 },
} satisfies ToolExample<Input, Output>;
export const isoWeekdayCycleOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/iso-weekday-cycle-offset",
    title: "ISO Weekday Cycle Offset Tool",
    description:
      "Calculate iso weekday cycle offset from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weekday: { type: "integer", minimum: 1, maximum: 7 },
        dayOffset: { type: "integer" },
      },
      required: ["weekday", "dayOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weekday: { type: "integer" },
        weekCarry: { type: "integer" },
      },
      required: ["weekday", "weekCarry"],
    },
    ports: {
      inputs: [
        {
          id: "weekday",
          label: "Weekday",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "dayOffset",
          label: "Day Offset",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "weekday", label: "Weekday", valueType: { type: "integer" } },
        {
          id: "weekCarry",
          label: "Week Carry",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = isoWeekdayCycleOffsetTool.execute;
export default isoWeekdayCycleOffsetTool;
