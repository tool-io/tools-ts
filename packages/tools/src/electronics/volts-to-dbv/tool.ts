import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const voltsToDbvExample = {
  input: { voltsRms: 1 },
} satisfies ToolExample<{
  readonly voltsRms: number;
}>;

export const voltsToDbvTool = createSimpleTool({
  id: "electronics/volts-to-dbv",
  title: "Volts To dBV",
  description:
    "Convert a signal level in volts RMS to dBV relative to the 0 dBV reference of 1 V.",
  inputs: [{ id: "voltsRms", label: "Voltage RMS", kind: "number" }],
  outputs: [{ id: "dbv", label: "Level", kind: "number" }],
  calculate: (input) => {
    const voltsRms = input.voltsRms as number;
    if (voltsRms <= 0)
      simpleError("voltsRms", "Voltage must be greater than zero.");
    return { dbv: 20 * Math.log10(voltsRms) };
  },
});
export const runVoltsToDbv = voltsToDbvTool.execute;
export default voltsToDbvTool;
