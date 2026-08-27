import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const antennaGainLinearToDbExample = {
  input: { linearRatio: 100 },
} satisfies ToolExample<{
  readonly linearRatio: number;
}>;

export const antennaGainLinearToDbTool = createSimpleTool({
  id: "electronics/antenna-gain-linear-to-db",
  title: "Linear Gain To dB",
  description:
    "Convert a linear antenna power ratio to an equivalent gain in decibels.",
  inputs: [{ id: "linearRatio", label: "Power ratio", kind: "number" }],
  outputs: [{ id: "antennaGainDb", label: "Gain", kind: "number" }],
  calculate: (input) => {
    const linearRatio = input.linearRatio as number;
    if (linearRatio <= 0)
      simpleError("linearRatio", "Power ratio must be greater than zero.");
    return { antennaGainDb: 10 * Math.log10(linearRatio) };
  },
});
export const runAntennaGainLinearToDb = antennaGainLinearToDbTool.execute;
export default antennaGainLinearToDbTool;
