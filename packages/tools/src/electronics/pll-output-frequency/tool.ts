import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PllOutputFrequencyInput = {
  readonly feedbackDivideInt: number;
  readonly referenceDivideInt: number;
  readonly referenceHz: number;
};

export type PllOutputFrequencyOutput = {
  readonly outputFrequencyHz: number;
};

export const pllOutputFrequencyExample = {
  input: {
    feedbackDivideInt: 72,
    referenceDivideInt: 2,
    referenceHz: 10000000,
  },
  output: { outputFrequencyHz: 360000000 },
} satisfies ToolExample<PllOutputFrequencyInput, PllOutputFrequencyOutput>;

export const calculatePllOutputFrequency = (
  input: PllOutputFrequencyInput,
): PllOutputFrequencyOutput => {
  if (!(input.referenceHz > 0))
    simpleError(
      "referenceHz",
      "Reference frequency must be positive.",
      "invalid_frequency",
    );
  if (
    !Number.isSafeInteger(input.feedbackDivideInt) ||
    input.feedbackDivideInt < 1
  )
    simpleError(
      "feedbackDivideInt",
      "Feedback divider must be an integer of at least one.",
      "invalid_divider",
    );
  if (
    !Number.isSafeInteger(input.referenceDivideInt) ||
    input.referenceDivideInt < 1
  )
    simpleError(
      "referenceDivideInt",
      "Reference divider must be an integer of at least one.",
      "invalid_divider",
    );
  return {
    outputFrequencyHz:
      (input.referenceHz * input.feedbackDivideInt) / input.referenceDivideInt,
  };
};

export const pllOutputFrequencyTool = createSimpleTool({
  calculate: (input) =>
    calculatePllOutputFrequency(input as unknown as PllOutputFrequencyInput),
  description:
    "Compute the output frequency of a phase-locked loop from the reference frequency and divider ratios.",
  id: "electronics/pll-output-frequency",
  inputs: [
    {
      description: "Frequency of the reference oscillator.",
      format: "frequency",
      id: "referenceHz",
      kind: "number",
      label: "Reference frequency",
      unit: "Hz",
    },
    {
      description: "Feedback divider ratio N.",
      id: "feedbackDivideInt",
      kind: "integer",
      label: "Feedback divider",
      minimum: 1,
    },
    {
      description: "Reference divider ratio R.",
      id: "referenceDivideInt",
      kind: "integer",
      label: "Reference divider",
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Synthesized output frequency.",
      format: "frequency",
      id: "outputFrequencyHz",
      kind: "number",
      label: "Output frequency",
      unit: "Hz",
    },
  ],
  title: "PLL Output Frequency",
});
export const runPllOutputFrequency = pllOutputFrequencyTool.execute;
export default pllOutputFrequencyTool;
