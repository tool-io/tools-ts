import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const phantomPowerCurrentExample = {
  input: { feedResistorEachOhms: 6800, phantomVolts: 48 },
} satisfies ToolExample<{
  readonly feedResistorEachOhms: number;
  readonly phantomVolts: number;
}>;

export const phantomPowerCurrentTool = createSimpleTool({
  id: "electronics/phantom-power-current",
  title: "Phantom Current Per Mic",
  description:
    "Compute P48 phantom current per microphone as currentMa = phantomVolts / (feedResistorEachOhms * 2) * 1000 through the series pair of feed resistors.",
  inputs: [
    {
      description: "Phantom supply voltage; P48 is 48 V.",
      id: "phantomVolts",
      kind: "number",
      label: "Phantom Voltage",
      unit: "V",
    },
    {
      description: "Value of each of the two series feed resistors.",
      id: "feedResistorEachOhms",
      kind: "number",
      label: "Feed Resistor",
      unit: "Ω",
    },
  ],
  outputs: [
    {
      description: "Quiescent current drawn by one mic input.",
      id: "phantomCurrentMa",
      kind: "number",
      label: "Current Per Mic",
      unit: "mA",
    },
  ],
  calculate: (input) => {
    const phantomVolts = input.phantomVolts as number;
    const feedResistorEachOhms = input.feedResistorEachOhms as number;
    if (!(phantomVolts > 0))
      simpleError("phantomVolts", "Phantom voltage must be positive.");
    if (!(feedResistorEachOhms > 0))
      simpleError("feedResistorEachOhms", "Feed resistance must be positive.");
    return {
      phantomCurrentMa: (phantomVolts / (feedResistorEachOhms * 2)) * 1000,
    };
  },
});
export const runPhantomPowerCurrent = phantomPowerCurrentTool.execute;
export default phantomPowerCurrentTool;
