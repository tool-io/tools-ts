import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const theveninVoltageExample = {
  input: { r1Ohms: 1000, r2Ohms: 2000, supplyVolts: 12 },
} satisfies ToolExample<{
  readonly r1Ohms: number;
  readonly r2Ohms: number;
  readonly supplyVolts: number;
}>;

export const theveninVoltageTool = createSimpleTool({
  id: "electronics/thevenin-voltage",
  title: "Thevenin Voltage",
  description:
    "Compute the Thevenin voltage of a resistive divider from the supply voltage and both divider resistances.",
  inputs: [
    { id: "supplyVolts", label: "Supply voltage", kind: "number" },
    { id: "r1Ohms", label: "Resistance R1", kind: "number" },
    { id: "r2Ohms", label: "Resistance R2", kind: "number" },
  ],
  outputs: [
    { id: "theveninVoltage", label: "Thevenin voltage", kind: "number" },
  ],
  calculate: (input) => {
    const supplyVolts = input.supplyVolts as number;
    const r1Ohms = input.r1Ohms as number;
    const r2Ohms = input.r2Ohms as number;
    if (supplyVolts <= 0)
      simpleError("supplyVolts", "Supply voltage must be greater than zero.");
    if (r1Ohms <= 0) simpleError("r1Ohms", "R1 must be greater than zero.");
    if (r2Ohms <= 0) simpleError("r2Ohms", "R2 must be greater than zero.");
    return {
      theveninVoltage: (supplyVolts * r2Ohms) / (r1Ohms + r2Ohms),
    };
  },
});
export const runTheveninVoltage = theveninVoltageTool.execute;
export default theveninVoltageTool;
