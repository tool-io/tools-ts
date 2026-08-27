import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const i2cPullupResistorMaxExample = {
  input: { busCapacitancePf: 100, riseTimeNs: 1000 },
} satisfies ToolExample<{
  readonly busCapacitancePf: number;
  readonly riseTimeNs: number;
}>;

export const i2cPullupResistorMaxTool = createSimpleTool({
  id: "electronics/i2c-pullup-resistor-max",
  title: "I2C Pullup Max",
  description:
    "Compute the maximum I2C pull-up resistance from the bus rise time and total bus capacitance using Rp(max) = trise / (0.8473 x Cb).",
  inputs: [
    { id: "riseTimeNs", label: "Rise time", kind: "number", unit: "ns" },
    {
      id: "busCapacitancePf",
      label: "Bus capacitance",
      kind: "number",
      unit: "pF",
    },
  ],
  outputs: [
    {
      id: "maxPullupOhms",
      label: "Maximum pull-up resistance",
      kind: "number",
      unit: "\u03a9",
    },
  ],
  calculate: (input) => {
    const riseTimeNs = input.riseTimeNs as number;
    const busCapacitancePf = input.busCapacitancePf as number;
    if (!(riseTimeNs > 0))
      simpleError("riseTimeNs", "Rise time must be positive.", "invalid_time");
    if (!(busCapacitancePf > 0))
      simpleError(
        "busCapacitancePf",
        "Bus capacitance must be positive.",
        "invalid_capacitance",
      );
    return {
      maxPullupOhms: (riseTimeNs / (0.8473 * busCapacitancePf)) * 1000,
    };
  },
});
export const runI2cPullupResistorMax = i2cPullupResistorMaxTool.execute;
export default i2cPullupResistorMaxTool;
