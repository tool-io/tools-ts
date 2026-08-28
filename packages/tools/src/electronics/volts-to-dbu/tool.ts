import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const voltsToDbuExample = {
  input: { voltsRms: 0.7746 },
} satisfies ToolExample<{
  readonly voltsRms: number;
}>;

export const voltsToDbuTool = createSimpleTool({
  id: "electronics/volts-to-dbu",
  title: "Volts To dBu",
  description:
    "Convert a signal level in volts RMS to dBu using the 0 dBu reference of 0.7746 V.",
  inputs: [{ id: "voltsRms", label: "Voltage RMS", kind: "number" }],
  outputs: [{ id: "dbu", label: "Level", kind: "number" }],
  calculate: (input) => {
    const voltsRms = input.voltsRms as number;
    if (voltsRms <= 0)
      simpleError("voltsRms", "Voltage must be greater than zero.");
    return { dbu: 20 * Math.log10(voltsRms / 0.7746) };
  },
});
export const runVoltsToDbu = voltsToDbuTool.execute;
export default voltsToDbuTool;
