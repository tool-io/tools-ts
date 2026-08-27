import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AttenuatorPowerInput = {
  readonly pIn: number;
  readonly pOut: number;
};

export type AttenuatorPowerOutput = {
  readonly attenuationDb: number;
};

export const attenuatorPowerExample = {
  input: { pIn: 1, pOut: 0.5 },
  output: { attenuationDb: -3.010299956639812 },
} satisfies ToolExample<AttenuatorPowerInput, AttenuatorPowerOutput>;

export const calculateAttenuatorPower = (
  input: AttenuatorPowerInput,
): AttenuatorPowerOutput => {
  if (!(input.pOut > 0))
    simpleError("pOut", "Output power must be positive.", "invalid_power");
  if (!(input.pIn > 0))
    simpleError("pIn", "Input power must be positive.", "invalid_power");
  return { attenuationDb: 10 * Math.log10(input.pOut / input.pIn) };
};

export const attenuatorPowerTool = createSimpleTool({
  calculate: (input) =>
    calculateAttenuatorPower(input as unknown as AttenuatorPowerInput),
  description:
    "Compute power attenuation in decibels from output and input power.",
  id: "electronics/attenuator-power",
  inputs: [
    {
      description: "Power delivered into the attenuator.",
      format: "power",
      id: "pIn",
      kind: "number",
      label: "Input power",
      unit: "W",
    },
    {
      description: "Power available at the attenuator output.",
      format: "power",
      id: "pOut",
      kind: "number",
      label: "Output power",
      unit: "W",
    },
  ],
  outputs: [
    {
      description: "Attenuation in decibels; negative for loss.",
      format: "decibels",
      id: "attenuationDb",
      kind: "number",
      label: "Attenuation",
      unit: "dB",
    },
  ],
  title: "Power Attenuator dB",
});
export const runAttenuatorPower = attenuatorPowerTool.execute;
export default attenuatorPowerTool;
