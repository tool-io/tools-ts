import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const dbvToVoltsExample = {
  input: { dbv: 0 },
} satisfies ToolExample<{
  readonly dbv: number;
}>;

export const dbvToVoltsTool = createSimpleTool({
  id: "electronics/dbv-to-volts",
  title: "dBV To Volts",
  description:
    "Convert a signal level in dBV to volts RMS using the 0 dBV reference of 1 V.",
  inputs: [{ id: "dbv", label: "Level", kind: "number" }],
  outputs: [{ id: "voltsRms", label: "Voltage RMS", kind: "number" }],
  calculate: (input) => {
    const dbv = input.dbv as number;
    return { voltsRms: Math.pow(10, dbv / 20) };
  },
});
export const runDbvToVolts = dbvToVoltsTool.execute;
export default dbvToVoltsTool;
