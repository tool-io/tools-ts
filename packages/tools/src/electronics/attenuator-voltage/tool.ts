import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AttenuatorVoltageInput = {
  readonly vIn: number;
  readonly vOut: number;
};

export type AttenuatorVoltageOutput = {
  readonly voltageAttenuationLinear: number;
};

export const attenuatorVoltageExample = {
  input: { vIn: 2, vOut: 0.5 },
  output: { voltageAttenuationLinear: 0.25 },
} satisfies ToolExample<AttenuatorVoltageInput, AttenuatorVoltageOutput>;

export const calculateAttenuatorVoltage = (
  input: AttenuatorVoltageInput,
): AttenuatorVoltageOutput => {
  if (input.vIn === 0)
    simpleError("vIn", "Input voltage must not be zero.", "must_be_nonzero");
  return { voltageAttenuationLinear: input.vOut / input.vIn };
};

export const attenuatorVoltageTool = createSimpleTool({
  calculate: (input) =>
    calculateAttenuatorVoltage(input as unknown as AttenuatorVoltageInput),
  description:
    "Compute the linear voltage attenuation ratio from output over input voltage.",
  id: "electronics/attenuator-voltage",
  inputs: [
    {
      description: "Voltage applied to the attenuator input.",
      format: "voltage",
      id: "vIn",
      kind: "number",
      label: "Input voltage",
      unit: "V",
    },
    {
      description: "Voltage measured at the attenuator output.",
      format: "voltage",
      id: "vOut",
      kind: "number",
      label: "Output voltage",
      unit: "V",
    },
  ],
  outputs: [
    {
      description: "Linear attenuation ratio vOut / vIn.",
      format: "factor",
      id: "voltageAttenuationLinear",
      kind: "number",
      label: "Attenuation",
    },
  ],
  title: "Voltage Attenuator Ratio",
});
export const runAttenuatorVoltage = attenuatorVoltageTool.execute;
export default attenuatorVoltageTool;
