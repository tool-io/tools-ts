import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WattsToDbmInput = {
  readonly watts: number;
};

export type WattsToDbmOutput = {
  readonly dbm: number;
};

export const wattsToDbmExample = {
  input: { watts: 1 },
  output: { dbm: 30 },
} satisfies ToolExample<WattsToDbmInput, WattsToDbmOutput>;

export const wattsToDbmTool = createSimpleTool({
  calculate: (input) => {
    const { watts } = input as unknown as WattsToDbmInput;
    if (watts <= 0)
      simpleError("watts", "Power must be positive.", "degenerate_input");
    return { dbm: 10 * Math.log10(watts) + 30 };
  },
  description: "Convert an absolute power level in watts to dBm.",
  id: "electronics/watts-to-dbm",
  inputs: [{ id: "watts", kind: "number", label: "Power", unit: "W" }],
  outputs: [{ id: "dbm", kind: "number", label: "Power level", unit: "dBm" }],
  title: "Watts To dBm",
});
export const runWattsToDbm = wattsToDbmTool.execute;
export default wattsToDbmTool;
