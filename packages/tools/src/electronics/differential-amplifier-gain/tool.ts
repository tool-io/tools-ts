import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DifferentialAmplifierGainInput = {
  readonly feedbackResistorOhms: number;
  readonly inputResistorOhms: number;
};

export type DifferentialAmplifierGainOutput = {
  readonly differentialGain: number;
};

export const differentialAmplifierGainExample = {
  input: { feedbackResistorOhms: 10000, inputResistorOhms: 1000 },
  output: { differentialGain: 10 },
} satisfies ToolExample<
  DifferentialAmplifierGainInput,
  DifferentialAmplifierGainOutput
>;

export const calculateDifferentialAmplifierGain = (
  input: DifferentialAmplifierGainInput,
): DifferentialAmplifierGainOutput => {
  if (!(input.feedbackResistorOhms > 0))
    simpleError(
      "feedbackResistorOhms",
      "Feedback resistor must be positive.",
      "invalid_feedback_resistor",
    );
  if (!(input.inputResistorOhms > 0))
    simpleError(
      "inputResistorOhms",
      "Input resistor must be positive.",
      "invalid_input_resistor",
    );
  return {
    differentialGain: input.feedbackResistorOhms / input.inputResistorOhms,
  };
};

export const differentialAmplifierGainTool = createSimpleTool({
  calculate: (input) =>
    calculateDifferentialAmplifierGain(
      input as unknown as DifferentialAmplifierGainInput,
    ),
  description: "Compute the op-amp difference amplifier gain as Rf / Rin.",
  id: "electronics/differential-amplifier-gain",
  inputs: [
    {
      id: "feedbackResistorOhms",
      kind: "number",
      label: "Feedback resistor",
      unit: "Ω",
    },
    {
      id: "inputResistorOhms",
      kind: "number",
      label: "Input resistor",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      id: "differentialGain",
      kind: "number",
      label: "Differential gain",
      unit: "ratio",
    },
  ],
  title: "Diff Amp Gain",
});
export const runDifferentialAmplifierGain =
  differentialAmplifierGainTool.execute;
export default differentialAmplifierGainTool;
