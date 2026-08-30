import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly initialMedianFrequencyHz: number;
  readonly laterMedianFrequencyHz: number;
  readonly minimumDropPercent: number;
}>;
export type Output = Readonly<{
  readonly frequencyShiftPercent: number;
  readonly fatigueShiftFlag: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.initialMedianFrequencyHz <= 0 ||
    input.laterMedianFrequencyHz < 0 ||
    input.minimumDropPercent < 0
  )
    simpleError(
      "initialMedianFrequencyHz",
      "Positive baseline median frequency and nonnegative later value/threshold required.",
    );
  const frequencyShiftPercent =
    100 * (input.laterMedianFrequencyHz / input.initialMedianFrequencyHz - 1);
  return {
    frequencyShiftPercent,
    fatigueShiftFlag: frequencyShiftPercent <= -input.minimumDropPercent,
  };
};
export const exampleInput = {
  initialMedianFrequencyHz: 100,
  laterMedianFrequencyHz: 80,
  minimumDropPercent: 10,
} satisfies Input;
export const exampleOutput = {
  frequencyShiftPercent: -19.999999999999996,
  fatigueShiftFlag: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "kinesiology/emg-median-frequency-shift",
  title: "EMG Median Frequency Shift",
  description:
    "Flag an EMG median-frequency decline against a caller-selected fatigue threshold.",
  inputs: [
    {
      id: "initialMedianFrequencyHz",
      label: "Initial median frequency hz",
      kind: "number",
    },
    {
      id: "laterMedianFrequencyHz",
      label: "Later median frequency hz",
      kind: "number",
    },
    { id: "minimumDropPercent", label: "Minimum drop percent", kind: "number" },
  ],
  outputs: [
    {
      id: "frequencyShiftPercent",
      label: "Frequency shift percent",
      kind: "number",
    },
    { id: "fatigueShiftFlag", label: "Fatigue shift flag", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      initialMedianFrequencyHz: value.initialMedianFrequencyHz as number,
      laterMedianFrequencyHz: value.laterMedianFrequencyHz as number,
      minimumDropPercent: value.minimumDropPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
