import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
  mod,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly previous: number;
  readonly current: number;
  readonly width: number;
};
export type Output = { readonly ticks: number; readonly wrapped: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "integer", minimum: 0 },
    current: { type: "integer", minimum: 0 },
    width: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["previous", "current", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ticks: { type: "number" }, wrapped: { type: "boolean" } },
  required: ["ticks", "wrapped"],
} as const;
/** Compute timer capture counter wrap delta from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { previous, current, width } = input;
  const compute = (): Output => {
    integer(width, 1, 32);
    integer(previous, 0, 2 ** width - 1);
    integer(current, 0, 2 ** width - 1);
    return {
      ticks: mod(current - previous, 2 ** width),
      wrapped: current < previous,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { previous: 250, current: 5, width: 8 },
  output: { ticks: 11, wrapped: true },
} satisfies ToolExample<Input, Output>;
export const timerCaptureCounterWrapDeltaTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "microcontroller/timer-capture-counter-wrap-delta",
  title: "Timer Capture Counter Wrap Delta Tool",
  description:
    "Compute timer capture counter wrap delta from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "previous",
        label: "Previous",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "current",
        label: "Current",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "width",
        label: "Width",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "ticks", label: "Ticks", valueType: { type: "number" } },
      { id: "wrapped", label: "Wrapped", valueType: { type: "boolean" } },
    ],
  },
});
export const run = timerCaptureCounterWrapDeltaTool.execute;
export default timerCaptureCounterWrapDeltaTool;
