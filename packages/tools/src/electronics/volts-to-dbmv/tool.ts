import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const voltsToDbmvExample = {
  input: { volts: 0.1 },
} satisfies ToolExample<{
  readonly volts: number;
}>;

export const voltsToDbmvTool = createSimpleTool({
  id: "electronics/volts-to-dbmv",
  title: "Volts To dBmV",
  description:
    "Convert a signal voltage in volts to a level in dBmV referenced to 1 mV.",
  inputs: [{ id: "volts", label: "Voltage", kind: "number" }],
  outputs: [{ id: "dbmv", label: "Level", kind: "number" }],
  calculate: (input) => {
    const volts = input.volts as number;
    if (volts <= 0) simpleError("volts", "Voltage must be greater than zero.");
    return { dbmv: 20 * Math.log10(volts / 0.001) };
  },
});
export const runVoltsToDbmv = voltsToDbmvTool.execute;
export default voltsToDbmvTool;
