import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TideRangeInput = {
  readonly highWaterMeters: number;
  readonly lowWaterMeters: number;
};

export type TideRangeOutput = {
  readonly tidalRangeMeters: number;
};

export const tideRangeExample = {
  input: { highWaterMeters: 2.5, lowWaterMeters: 0.5 },
  output: { tidalRangeMeters: 2 },
} satisfies ToolExample<TideRangeInput, TideRangeOutput>;

export const tideRangeTool = createSimpleTool({
  id: "nautical/tide-range",
  title: "Tide Range Calculator",
  description:
    "Calculate tidal range in meters as high-water height minus low-water height, using heights referenced to the same chart datum.",
  inputs: [
    { id: "highWaterMeters", kind: "number", label: "High water" },
    { id: "lowWaterMeters", kind: "number", label: "Low water" },
  ],
  outputs: [{ id: "tidalRangeMeters", kind: "number", label: "Tidal range" }],
  calculate: (input) => {
    const highWaterMeters = input.highWaterMeters as number;
    const lowWaterMeters = input.lowWaterMeters as number;
    if (highWaterMeters < lowWaterMeters)
      simpleError(
        "highWaterMeters",
        "High-water height must be at least the low-water height.",
      );
    return { tidalRangeMeters: highWaterMeters - lowWaterMeters };
  },
});
export const runTideRange = tideRangeTool.execute;
export default tideRangeTool;
