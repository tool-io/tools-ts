import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FrequencyToPeriodInput = {
  readonly frequencyHz: number;
};

export type FrequencyToPeriodOutput = {
  readonly periodSeconds: number;
};

export const frequencyToPeriodExample = {
  input: { frequencyHz: 50 },
  output: { periodSeconds: 0.02 },
} satisfies ToolExample<FrequencyToPeriodInput, FrequencyToPeriodOutput>;

export const calculateFrequencyToPeriod = (
  input: FrequencyToPeriodInput,
): FrequencyToPeriodOutput => {
  if (input.frequencyHz <= 0)
    simpleError(
      "frequencyHz",
      "The frequency must be positive.",
      "invalid_input",
    );
  return { periodSeconds: 1 / input.frequencyHz };
};

export const frequencyToPeriodTool = createSimpleTool({
  calculate: (input) =>
    calculateFrequencyToPeriod(input as unknown as FrequencyToPeriodInput),
  description:
    "Convert a repetitive event rate into its period, T = 1 / f; a 50 hertz mains supply completes one cycle every 20 milliseconds.",
  id: "electronics/frequency-to-period",
  inputs: [
    {
      description: "Number of cycles per second.",
      format: "frequency-hz",
      id: "frequencyHz",
      kind: "number",
      label: "Frequency",
      unit: "Hz",
    },
  ],
  outputs: [
    {
      description: "Duration of one complete cycle.",
      format: "duration-s",
      id: "periodSeconds",
      kind: "number",
      label: "Period",
      unit: "s",
    },
  ],
  title: "Frequency to Period Calculator",
});
export const runFrequencyToPeriod = frequencyToPeriodTool.execute;
export default frequencyToPeriodTool;
