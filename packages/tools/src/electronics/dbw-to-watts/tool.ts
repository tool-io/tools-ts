import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type DbwToWattsInput = {
  readonly dbw: number;
};

export type DbwToWattsOutput = {
  readonly watts: number;
};

export const dbwToWattsExample = {
  input: { dbw: 3 },
  output: { watts: 1.9952623149688795 },
} satisfies ToolExample<DbwToWattsInput, DbwToWattsOutput>;

export const dbwToWattsTool = createSimpleTool({
  calculate: (input) => {
    const { dbw } = input as unknown as DbwToWattsInput;
    return { watts: Math.pow(10, dbw / 10) };
  },
  description: "Convert an absolute power level in dBW to watts.",
  id: "electronics/dbw-to-watts",
  inputs: [{ id: "dbw", kind: "number", label: "Power level", unit: "dBW" }],
  outputs: [{ id: "watts", kind: "number", label: "Power", unit: "W" }],
  title: "dBW To Watts",
});
export const runDbwToWatts = dbwToWattsTool.execute;
export default dbwToWattsTool;
