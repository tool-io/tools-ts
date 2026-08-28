import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const zenerCurrentExample = {
  input: { seriesResistorOhms: 470, supplyVolts: 12, zenerVolts: 5.1 },
} satisfies ToolExample<{
  readonly seriesResistorOhms: number;
  readonly supplyVolts: number;
  readonly zenerVolts: number;
}>;

export const zenerCurrentTool = createSimpleTool({
  id: "electronics/zener-current",
  title: "Zener Current",
  description:
    "Compute the current through a Zener diode in milliamps given the supply voltage, Zener voltage, and series resistor.",
  inputs: [
    { id: "supplyVolts", label: "Supply voltage", kind: "number" },
    { id: "zenerVolts", label: "Zener voltage", kind: "number" },
    { id: "seriesResistorOhms", label: "Series resistor", kind: "number" },
  ],
  outputs: [{ id: "zenerCurrentMa", label: "Zener current", kind: "number" }],
  calculate: (input) => {
    const supplyVolts = input.supplyVolts as number;
    const zenerVolts = input.zenerVolts as number;
    const seriesResistorOhms = input.seriesResistorOhms as number;
    if (supplyVolts <= zenerVolts)
      simpleError(
        "supplyVolts",
        "Supply voltage must exceed the Zener voltage.",
        "insufficient_supply",
      );
    if (seriesResistorOhms <= 0)
      simpleError(
        "seriesResistorOhms",
        "Series resistor must be greater than zero.",
      );
    return {
      zenerCurrentMa: ((supplyVolts - zenerVolts) / seriesResistorOhms) * 1000,
    };
  },
});
export const runZenerCurrent = zenerCurrentTool.execute;
export default zenerCurrentTool;
