import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputFrequencyHz: number;
  readonly prescalerDivisors: readonly number[];
  readonly maximumTickHz: number;
};
export type Output = { readonly prescaler: number; readonly tickHz: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputFrequencyHz: { type: "number", exclusiveMinimum: 0 },
    prescalerDivisors: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    maximumTickHz: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["inputFrequencyHz", "prescalerDivisors", "maximumTickHz"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { prescaler: { type: "integer" }, tickHz: { type: "number" } },
  required: ["prescaler", "tickHz"],
} as const;
/** Choose the smallest caller-supported watchdog prescaler keeping tick frequency at or below a supplied limit; no device register encoding is invented. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputFrequencyHz, prescalerDivisors, maximumTickHz } = request;
  const compute = (): Output => {
    (H.domain(inputFrequencyHz > 0, "inputFrequencyHz"), inputFrequencyHz);
    (H.domain(maximumTickHz > 0, "maximumTickHz"), maximumTickHz);
    H.domain(prescalerDivisors.length > 0, "prescalerDivisors");
    prescalerDivisors.forEach((d) => H.integer(d, 1));
    const eligible = [...new Set(prescalerDivisors)]
      .filter((d) => inputFrequencyHz / d <= maximumTickHz)
      .sort((a, b) => a - b);
    H.domain(eligible.length > 0, "maximumTickHz");
    const prescaler = eligible[0];
    return { prescaler, tickHz: inputFrequencyHz / prescaler };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inputFrequencyHz: 32000,
    prescalerDivisors: [1, 8, 64, 256],
    maximumTickHz: 1000,
  },
  output: { prescaler: 64, tickHz: 500 },
} satisfies ToolExample<Input, Output>;
export const watchdogPreScalerSettingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microcontroller/watchdog-pre-scaler-setting",
    title: "Watchdog Pre Scaler Setting Tool",
    description:
      "Choose the smallest caller-supported watchdog prescaler keeping tick frequency at or below a supplied limit; no device register encoding is invented.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputFrequencyHz: { type: "number", exclusiveMinimum: 0 },
        prescalerDivisors: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        maximumTickHz: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["inputFrequencyHz", "prescalerDivisors", "maximumTickHz"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prescaler: { type: "integer" },
        tickHz: { type: "number" },
      },
      required: ["prescaler", "tickHz"],
    },
    ports: {
      inputs: [
        {
          id: "inputFrequencyHz",
          label: "Input Frequency Hz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "prescalerDivisors",
          label: "Prescaler Divisors",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "maximumTickHz",
          label: "Maximum Tick Hz",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "prescaler", label: "Prescaler", valueType: { type: "integer" } },
        { id: "tickHz", label: "Tick Hz", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = watchdogPreScalerSettingTool.execute;
export default watchdogPreScalerSettingTool;
