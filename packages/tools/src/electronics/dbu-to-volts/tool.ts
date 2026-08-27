import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const dbuToVoltsExample = {
  input: { dbu: 0 },
} satisfies ToolExample<{
  readonly dbu: number;
}>;

export const dbuToVoltsTool = createSimpleTool({
  id: "electronics/dbu-to-volts",
  title: "dBu To Volts",
  description:
    "Convert a signal level in dBu to volts RMS using the 0 dBu reference of 0.7746 V.",
  inputs: [{ id: "dbu", label: "Level", kind: "number" }],
  outputs: [{ id: "voltsRms", label: "Voltage RMS", kind: "number" }],
  calculate: (input) => {
    const dbu = input.dbu as number;
    return { voltsRms: 0.7746 * Math.pow(10, dbu / 20) };
  },
});
export const runDbuToVolts = dbuToVoltsTool.execute;
export default dbuToVoltsTool;
