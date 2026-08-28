import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const voltageGainDbExample = {
  input: { inputVoltageVolts: 1, outputVoltageVolts: 10 },
  output: { gainDb: 20 },
} satisfies ToolExample<
  { readonly inputVoltageVolts: number; readonly outputVoltageVolts: number },
  { readonly gainDb: number }
>;

export const voltageGainDbTool = createSimpleTool({
  calculate: (input) => {
    const vIn = input.inputVoltageVolts as number;
    const vOut = input.outputVoltageVolts as number;
    if (!(vIn > 0))
      simpleError(
        "inputVoltageVolts",
        "Input voltage must be positive.",
        "invalid_voltage",
      );
    if (!(vOut > 0))
      simpleError(
        "outputVoltageVolts",
        "Output voltage must be positive.",
        "invalid_voltage",
      );
    return { gainDb: 20 * Math.log10(vOut / vIn) };
  },
  description: "Express a voltage ratio as a decibel gain.",
  id: "electronics/voltage-gain-db",
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
  outputs: [{ id: "gainDb", kind: "number", label: "Gain", unit: "dB" }],
  title: "Voltage Gain dB",
});
export const runVoltageGainDb = voltageGainDbTool.execute;
export default voltageGainDbTool;
