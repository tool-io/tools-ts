import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VariableGainAmplifierGainInput = Readonly<{
  readonly inputRmsVolts: number;
  readonly outputRmsVolts: number;
}>;
export type VariableGainAmplifierGainOutput = Readonly<{
  readonly gainDecibels: number;
}>;

export const calculateVariableGainAmplifierGain = (
  x: VariableGainAmplifierGainInput,
): VariableGainAmplifierGainOutput => {
  if (!Number.isFinite(x.inputRmsVolts) || x.inputRmsVolts < 0)
    simpleError("inputRmsVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.outputRmsVolts) || x.outputRmsVolts < 0)
    simpleError("outputRmsVolts", "Provide a finite number at least 0.");
  const gainDecibels = 20 * Math.log10(x.outputRmsVolts / x.inputRmsVolts);
  if (!Number.isFinite(gainDecibels))
    simpleError(
      "gainDecibels",
      "Inputs produce an undefined or non-finite result.",
    );
  return { gainDecibels: Object.is(gainDecibels, -0) ? 0 : gainDecibels };
};

export const example = {
  input: { inputRmsVolts: 0.1, outputRmsVolts: 1 },
  output: { gainDecibels: 20 },
} satisfies ToolExample<
  VariableGainAmplifierGainInput,
  VariableGainAmplifierGainOutput
>;

export const tool = createSimpleTool({
  id: "electronics/variable-gain-amplifier-gain",
  title: "Variable Gain Amplifier Gain",
  description:
    "Voltage gain in decibels from output and input RMS amplitudes at a given gain-control setting.",
  inputs: [
    {
      id: "inputRmsVolts",
      kind: "number",
      label: "Input Rms Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "outputRmsVolts",
      kind: "number",
      label: "Output Rms Volts",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "gainDecibels", kind: "number", label: "Gain Decibels", unit: "dB" },
  ],
  calculate: (input) =>
    calculateVariableGainAmplifierGain({
      inputRmsVolts: input.inputRmsVolts as number,
      outputRmsVolts: input.outputRmsVolts as number,
    }),
});
export const variableGainAmplifierGainTool = tool;
export const runVariableGainAmplifierGain = tool.execute;
export default tool;
