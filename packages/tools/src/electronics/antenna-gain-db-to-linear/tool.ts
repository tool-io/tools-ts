import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const antennaGainDbToLinearExample = {
  input: { gainDb: 30 },
} satisfies ToolExample<{
  readonly gainDb: number;
}>;

export const antennaGainDbToLinearTool = createSimpleTool({
  id: "electronics/antenna-gain-db-to-linear",
  title: "Gain dB To Linear",
  description:
    "Convert an antenna power gain in decibels to a linear power ratio.",
  inputs: [{ id: "gainDb", label: "Gain", kind: "number" }],
  outputs: [{ id: "powerGainLinear", label: "Power gain", kind: "number" }],
  calculate: (input) => {
    const gainDb = input.gainDb as number;
    return { powerGainLinear: Math.pow(10, gainDb / 10) };
  },
});
export const runAntennaGainDbToLinear = antennaGainDbToLinearTool.execute;
export default antennaGainDbToLinearTool;
