import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DbmToWattsInput = {
  readonly dbm: number;
};

export type DbmToWattsOutput = {
  readonly watts: number;
};

export const dbmToWattsExample = {
  input: { dbm: 30 },
  output: { watts: 1 },
} satisfies ToolExample<DbmToWattsInput, DbmToWattsOutput>;

export const dbmToWattsTool = createSimpleTool({
  calculate: (input) => {
    const { dbm } = input as unknown as DbmToWattsInput;
    return { watts: Math.pow(10, (dbm - 30) / 10) };
  },
  description: "Convert an absolute power level in dBm to watts.",
  id: "electronics/dbm-to-watts",
  inputs: [{ id: "dbm", kind: "number", label: "Power level", unit: "dBm" }],
  outputs: [{ id: "watts", kind: "number", label: "Power", unit: "W" }],
  title: "dBm To Watts",
});
export const runDbmToWatts = dbmToWattsTool.execute;
export default dbmToWattsTool;
