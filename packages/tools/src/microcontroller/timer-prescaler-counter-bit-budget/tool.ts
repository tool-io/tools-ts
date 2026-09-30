import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputTicks: number;
  readonly prescaler: number;
  readonly bits: number;
};
export type Output = {
  readonly counterTicks: number;
  readonly overflows: number;
  readonly remainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputTicks: { type: "integer", minimum: 0 },
    prescaler: { type: "integer", minimum: 1 },
    bits: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["inputTicks", "prescaler", "bits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counterTicks: { type: "integer" },
    overflows: { type: "integer" },
    remainder: { type: "integer" },
  },
  required: ["counterTicks", "overflows", "remainder"],
} as const;
/** Calculate timer prescaler counter bit budget from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { inputTicks, prescaler, bits } = input;
  const compute = (): Output => {
    H.integer(inputTicks, 0);
    H.integer(prescaler, 1);
    H.integer(bits, 1, 32);
    const counterTicks = Math.floor(inputTicks / prescaler),
      range = 2 ** bits;
    return {
      counterTicks,
      overflows: Math.floor(counterTicks / range),
      remainder: counterTicks % range,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { inputTicks: 1000, prescaler: 4, bits: 8 },
  output: { counterTicks: 250, overflows: 0, remainder: 250 },
} satisfies ToolExample<Input, Output>;
export const timerPrescalerCounterBitBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/timer-prescaler-counter-bit-budget",
    title: "Timer Prescaler Counter Bit Budget Tool",
    description:
      "Calculate timer prescaler counter bit budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputTicks: { type: "integer", minimum: 0 },
        prescaler: { type: "integer", minimum: 1 },
        bits: { type: "integer", minimum: 1, maximum: 32 },
      },
      required: ["inputTicks", "prescaler", "bits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counterTicks: { type: "integer" },
        overflows: { type: "integer" },
        remainder: { type: "integer" },
      },
      required: ["counterTicks", "overflows", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "inputTicks",
          label: "Input Ticks",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "prescaler",
          label: "Prescaler",
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
          id: "counterTicks",
          label: "Counter Ticks",
          valueType: { type: "integer" },
        },
        { id: "overflows", label: "Overflows", valueType: { type: "integer" } },
        { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = timerPrescalerCounterBitBudgetTool.execute;
export default timerPrescalerCounterBitBudgetTool;
