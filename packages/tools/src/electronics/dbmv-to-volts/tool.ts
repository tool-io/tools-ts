import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const dbmvToVoltsExample = {
  input: { dbmv: 0 },
} satisfies ToolExample<{
  readonly dbmv: number;
}>;

export const dbmvToVoltsTool = createSimpleTool({
  id: "electronics/dbmv-to-volts",
  title: "dBmV To Volts",
  description:
    "Convert a signal level in dBmV to volts using the 0 dBmV reference of 1 mV.",
  inputs: [{ id: "dbmv", label: "Level", kind: "number" }],
  outputs: [{ id: "volts", label: "Voltage", kind: "number" }],
  calculate: (input) => {
    const dbmv = input.dbmv as number;
    return { volts: 0.001 * Math.pow(10, dbmv / 20) };
  },
});
export const runDbmvToVolts = dbmvToVoltsTool.execute;
export default dbmvToVoltsTool;
