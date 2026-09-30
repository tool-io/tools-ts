import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
  positive,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly top: number;
  readonly clockHz: number;
  readonly prescaler: number;
};
export type Output = { readonly ticks: number; readonly periodSeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    top: { type: "integer", minimum: 1, maximum: 1000000000 },
    clockHz: { type: "number", exclusiveMinimum: 0 },
    prescaler: { type: "integer", minimum: 1, maximum: 1000000 },
  },
  required: ["top", "clockHz", "prescaler"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ticks: { type: "integer" }, periodSeconds: { type: "number" } },
  required: ["ticks", "periodSeconds"],
} as const;
/** Compute timer up down counter turnaround period from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { top, clockHz, prescaler } = input;
  const compute = (): Output => {
    integer(top, 1, 1000000000);
    positive(clockHz);
    integer(prescaler, 1, 1000000);
    const ticks = 2 * top;
    return { ticks, periodSeconds: (ticks * prescaler) / clockHz };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { top: 100, clockHz: 1000, prescaler: 1 },
  output: { ticks: 200, periodSeconds: 0.2 },
} satisfies ToolExample<Input, Output>;
export const timerUpDownCounterTurnaroundPeriodTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/timer-up-down-counter-turnaround-period",
  title: "Timer Up Down Counter Turnaround Period Tool",
  description:
    "Compute timer up down counter turnaround period from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "top",
        label: "Top",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "clockHz",
        label: "Clock Hz",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "prescaler",
        label: "Prescaler",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "ticks", label: "Ticks", valueType: { type: "integer" } },
      {
        id: "periodSeconds",
        label: "Period Seconds",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = timerUpDownCounterTurnaroundPeriodTool.execute;
export default timerUpDownCounterTurnaroundPeriodTool;
