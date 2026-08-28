import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const voltageGainLinearExample = {
  input: { inputVoltageVolts: 2, outputVoltageVolts: 10 },
  output: { voltageGain: 5 },
} satisfies ToolExample<
  { readonly inputVoltageVolts: number; readonly outputVoltageVolts: number },
  { readonly voltageGain: number }
>;

export const voltageGainLinearTool = createSimpleTool({
  calculate: (input) => {
    const vIn = input.inputVoltageVolts as number;
    if (vIn === 0)
      simpleError(
        "inputVoltageVolts",
        "Input voltage must be nonzero.",
        "invalid_voltage",
      );
    return {
      voltageGain: (input.outputVoltageVolts as number) / vIn,
    };
  },
  description:
    "Compute the linear voltage gain as the ratio of output to input voltage.",
  id: "electronics/voltage-gain-linear",
  inputs: [
    {
      id: "inputVoltageVolts",
      kind: "number",
      label: "Input voltage",
      unit: "V",
    },
    {
      id: "outputVoltageVolts",
      kind: "number",
      label: "Output voltage",
      unit: "V",
    },
  ],
  outputs: [{ id: "voltageGain", kind: "number", label: "Gain", unit: "V/V" }],
  title: "Linear Voltage Gain",
});
export const runVoltageGainLinear = voltageGainLinearTool.execute;
export default voltageGainLinearTool;
