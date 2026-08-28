import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VcoGainInput = {
  readonly controlVoltageRangeVolts: number;
  readonly frequencyDeviationHz: number;
};

export type VcoGainOutput = {
  readonly vcoGainHzPerVolt: number;
};

export const vcoGainExample = {
  input: { controlVoltageRangeVolts: 5, frequencyDeviationHz: 50000000 },
  output: { vcoGainHzPerVolt: 10000000 },
} satisfies ToolExample<VcoGainInput, VcoGainOutput>;

export const calculateVcoGain = (input: VcoGainInput): VcoGainOutput => {
  if (!(input.frequencyDeviationHz > 0))
    simpleError(
      "frequencyDeviationHz",
      "Frequency deviation must be positive.",
      "invalid_frequency",
    );
  if (!(input.controlVoltageRangeVolts > 0))
    simpleError(
      "controlVoltageRangeVolts",
      "Control voltage range must be positive.",
      "invalid_voltage",
    );
  return {
    vcoGainHzPerVolt:
      input.frequencyDeviationHz / input.controlVoltageRangeVolts,
  };
};

export const vcoGainTool = createSimpleTool({
  calculate: (input) => calculateVcoGain(input as unknown as VcoGainInput),
  description:
    "Compute voltage-controlled oscillator gain from its tuning frequency deviation and control voltage range.",
  id: "electronics/vco-gain",
  inputs: [
    {
      description: "Total frequency deviation across the tuning range.",
      format: "frequency",
      id: "frequencyDeviationHz",
      kind: "number",
      label: "Frequency deviation",
      unit: "Hz",
    },
    {
      description: "Control voltage span producing the deviation.",
      format: "voltage",
      id: "controlVoltageRangeVolts",
      kind: "number",
      label: "Control voltage range",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Sensitivity of output frequency to control voltage.",
      format: "frequency",
      id: "vcoGainHzPerVolt",
      kind: "number",
      label: "VCO gain",
      unit: "Hz/V",
    },
  ],
  title: "VCO Gain",
});
export const runVcoGain = vcoGainTool.execute;
export default vcoGainTool;
