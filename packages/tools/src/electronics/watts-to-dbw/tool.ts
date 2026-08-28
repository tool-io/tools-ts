import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const wattsToDbwExample = {
  input: { watts: 1000 },
  output: { dbw: 30 },
} satisfies ToolExample<{ readonly watts: number }, { readonly dbw: number }>;

export const wattsToDbwTool = createSimpleTool({
  calculate: (input) => {
    const watts = input.watts as number;
    if (!(watts > 0))
      simpleError("watts", "Watts must be positive.", "invalid_power");
    return { dbw: 10 * Math.log10(watts) };
  },
  description: "Convert an absolute power level in watts to dBW.",
  id: "electronics/watts-to-dbw",
  inputs: [{ id: "watts", kind: "number", label: "Power", unit: "W" }],
  outputs: [{ id: "dbw", kind: "number", label: "Power level", unit: "dBW" }],
  title: "Watts To dBW",
});
export const runWattsToDbw = wattsToDbwTool.execute;
export default wattsToDbwTool;
