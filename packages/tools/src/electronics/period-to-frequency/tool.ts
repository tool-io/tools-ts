import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PeriodToFrequencyInput = {
  readonly periodSeconds: number;
};

export type PeriodToFrequencyOutput = {
  readonly frequencyHz: number;
};

export const periodToFrequencyExample = {
  input: { periodSeconds: 0.02 },
  output: { frequencyHz: 50 },
} satisfies ToolExample<PeriodToFrequencyInput, PeriodToFrequencyOutput>;

export const calculatePeriodToFrequency = (
  input: PeriodToFrequencyInput,
): PeriodToFrequencyOutput => {
  if (input.periodSeconds <= 0)
    simpleError(
      "periodSeconds",
      "The period must be positive.",
      "invalid_input",
    );
  return { frequencyHz: 1 / input.periodSeconds };
};

export const periodToFrequencyTool = createSimpleTool({
  calculate: (input) =>
    calculatePeriodToFrequency(input as unknown as PeriodToFrequencyInput),
  description:
    "Convert the duration of one cycle into its repetition rate, f = 1 / T.",
  id: "electronics/period-to-frequency",
  inputs: [
    {
      description: "Duration of one complete cycle.",
      format: "duration-s",
      id: "periodSeconds",
      kind: "number",
      label: "Period",
      unit: "s",
    },
  ],
  outputs: [
    {
      description: "Cycles completed per second.",
      format: "frequency-hz",
      id: "frequencyHz",
      kind: "number",
      label: "Frequency",
      unit: "Hz",
    },
  ],
  title: "Period to Frequency Calculator",
});
export const runPeriodToFrequency = periodToFrequencyTool.execute;
export default periodToFrequencyTool;
