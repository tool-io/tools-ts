import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ProgrammableGainAmplifierGainInput = Readonly<{
  readonly inputAmplitudeVolts: number;
  readonly outputAmplitudeVolts: number;
}>;
export type ProgrammableGainAmplifierGainOutput = Readonly<{
  readonly voltageGain: number;
}>;

export const calculateProgrammableGainAmplifierGain = (
  x: ProgrammableGainAmplifierGainInput,
): ProgrammableGainAmplifierGainOutput => {
  if (!Number.isFinite(x.inputAmplitudeVolts) || x.inputAmplitudeVolts < 0)
    simpleError("inputAmplitudeVolts", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.outputAmplitudeVolts) || x.outputAmplitudeVolts < 0)
    simpleError("outputAmplitudeVolts", "Provide a finite number at least 0.");
  const voltageGain = x.outputAmplitudeVolts / x.inputAmplitudeVolts;
  if (!Number.isFinite(voltageGain))
    simpleError(
      "voltageGain",
      "Inputs produce an undefined or non-finite result.",
    );
  return { voltageGain: Object.is(voltageGain, -0) ? 0 : voltageGain };
};

export const example = {
  input: { inputAmplitudeVolts: 0.1, outputAmplitudeVolts: 1 },
  output: { voltageGain: 10 },
} satisfies ToolExample<
  ProgrammableGainAmplifierGainInput,
  ProgrammableGainAmplifierGainOutput
>;

export const tool = createSimpleTool({
  id: "electronics/programmable-gain-amplifier-gain",
  title: "Programmable Gain Amplifier Gain",
  description:
    "Linear voltage gain at a selected programmable-amplifier setting from measured input and output amplitude.",
  inputs: [
    {
      id: "inputAmplitudeVolts",
      kind: "number",
      label: "Input Amplitude Volts",
      unit: "V",
      minimum: 0,
    },
    {
      id: "outputAmplitudeVolts",
      kind: "number",
      label: "Output Amplitude Volts",
      unit: "V",
      minimum: 0,
    },
  ],
  outputs: [{ id: "voltageGain", kind: "number", label: "Voltage Gain" }],
  calculate: (input) =>
    calculateProgrammableGainAmplifierGain({
      inputAmplitudeVolts: input.inputAmplitudeVolts as number,
      outputAmplitudeVolts: input.outputAmplitudeVolts as number,
    }),
});
export const programmableGainAmplifierGainTool = tool;
export const runProgrammableGainAmplifierGain = tool.execute;
export default tool;
