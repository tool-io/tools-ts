import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DecouplingResonanceFrequencyInput = {
  readonly cNf: number;
  readonly lNh: number;
};

export type DecouplingResonanceFrequencyOutput = {
  readonly resonanceFrequencyMhz: number;
};

export const decouplingResonanceFrequencyExample = {
  input: { cNf: 1, lNh: 1 },
  output: { resonanceFrequencyMhz: 159.155 },
} satisfies ToolExample<
  DecouplingResonanceFrequencyInput,
  DecouplingResonanceFrequencyOutput
>;

export const calculateDecouplingResonanceFrequency = (
  input: DecouplingResonanceFrequencyInput,
): DecouplingResonanceFrequencyOutput => {
  if (!(input.lNh > 0))
    simpleError(
      "lNh",
      "Mounted inductance must be positive.",
      "invalid_inductance",
    );
  if (!(input.cNf > 0))
    simpleError("cNf", "Capacitance must be positive.", "invalid_capacitance");
  return { resonanceFrequencyMhz: 159.155 / Math.sqrt(input.lNh * input.cNf) };
};

export const decouplingResonanceFrequencyTool = createSimpleTool({
  calculate: (input) =>
    calculateDecouplingResonanceFrequency(
      input as unknown as DecouplingResonanceFrequencyInput,
    ),
  description:
    "Compute the resonant frequency in megahertz of a decoupling capacitor from its mounted series inductance in nanohenries and capacitance in nanofarads.",
  id: "electronics/decoupling-resonance-frequency",
  inputs: [
    {
      description: "Mounted series inductance in nanohenries.",
      id: "lNh",
      kind: "number",
      label: "Mounted inductance",
      unit: "nH",
    },
    {
      description: "Capacitance in nanofarads.",
      id: "cNf",
      kind: "number",
      label: "Capacitance",
      unit: "nF",
    },
  ],
  outputs: [
    {
      description: "LC self-resonant frequency of the decoupling network.",
      id: "resonanceFrequencyMhz",
      kind: "number",
      label: "Resonance frequency",
      unit: "MHz",
    },
  ],
  title: "Decap Resonance",
});
export const runDecouplingResonanceFrequency =
  decouplingResonanceFrequencyTool.execute;
export default decouplingResonanceFrequencyTool;
