import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly captured: number;
  readonly current: number;
  readonly wraps: number;
  readonly bits: number;
};
export type Output = { readonly elapsedTicks: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    captured: { type: "integer", minimum: 0 },
    current: { type: "integer", minimum: 0 },
    wraps: { type: "integer", minimum: 0 },
    bits: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["captured", "current", "wraps", "bits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsedTicks: { type: "integer" } },
  required: ["elapsedTicks"],
} as const;
/** Calculate timer capture overflow age term from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { captured, current, wraps, bits } = input;
  const compute = (): Output => {
    H.integer(bits, 1, 32);
    const range = 2 ** bits;
    H.integer(captured, 0, range - 1);
    H.integer(current, 0, range - 1);
    H.integer(wraps, 0);
    const elapsedTicks = wraps * range + current - captured;
    H.integer(elapsedTicks, 0);
    return { elapsedTicks };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { captured: 250, current: 10, wraps: 1, bits: 8 },
  output: { elapsedTicks: 16 },
} satisfies ToolExample<Input, Output>;
export const timerCaptureOverflowAgeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/timer-capture-overflow-age-term",
    title: "Timer Capture Overflow Age Term Tool",
    description:
      "Calculate timer capture overflow age term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        captured: { type: "integer", minimum: 0 },
        current: { type: "integer", minimum: 0 },
        wraps: { type: "integer", minimum: 0 },
        bits: { type: "integer", minimum: 1, maximum: 32 },
      },
      required: ["captured", "current", "wraps", "bits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elapsedTicks: { type: "integer" } },
      required: ["elapsedTicks"],
    },
    ports: {
      inputs: [
        {
          id: "captured",
          label: "Captured",
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
          id: "wraps",
          label: "Wraps",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bits",
          label: "Bits",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "elapsedTicks",
          label: "Elapsed Ticks",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = timerCaptureOverflowAgeTermTool.execute;
export default timerCaptureOverflowAgeTermTool;
