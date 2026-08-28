import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const inrushCurrentLimiterExample = {
  input: { busVolts: 230, ntcColdResistanceOhms: 10 },
} satisfies ToolExample<{
  readonly busVolts: number;
  readonly ntcColdResistanceOhms: number;
}>;

export const inrushCurrentLimiterTool = createSimpleTool({
  id: "electronics/inrush-current-limiter",
  title: "NTC Inrush Peak",
  description:
    "Compute the peak inrush current through an NTC inrush limiter as the bus voltage divided by the NTC cold resistance.",
  inputs: [
    { id: "busVolts", label: "Bus voltage", kind: "number", unit: "V" },
    {
      id: "ntcColdResistanceOhms",
      label: "NTC cold resistance",
      kind: "number",
      unit: "\u03a9",
    },
  ],
  outputs: [
    {
      id: "inrushPeakCurrentA",
      label: "Peak inrush current",
      kind: "number",
      unit: "A",
    },
  ],
  calculate: (input) => {
    const busVolts = input.busVolts as number;
    const ntcColdResistanceOhms = input.ntcColdResistanceOhms as number;
    if (!(busVolts > 0))
      simpleError("busVolts", "Bus voltage must be positive.");
    if (!(ntcColdResistanceOhms > 0))
      simpleError(
        "ntcColdResistanceOhms",
        "NTC cold resistance must be positive.",
        "invalid_resistance",
      );
    return { inrushPeakCurrentA: busVolts / ntcColdResistanceOhms };
  },
});
export const runInrushCurrentLimiter = inrushCurrentLimiterTool.execute;
export default inrushCurrentLimiterTool;
