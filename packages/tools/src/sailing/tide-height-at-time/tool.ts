import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TideHeightAtTimeInput = {
  readonly highWaterMeters: number;
  readonly hoursFromHigh: number;
  readonly lowWaterMeters: number;
};

export type TideHeightAtTimeOutput = {
  readonly tideHeightMeters: number;
};

export const tideHeightAtTimeExample = {
  input: { highWaterMeters: 4, hoursFromHigh: 3, lowWaterMeters: 1 },
  output: { tideHeightMeters: 2.5 },
} satisfies ToolExample<TideHeightAtTimeInput, TideHeightAtTimeOutput>;

export const tideHeightAtTimeTool = createSimpleTool({
  calculate: (input) => {
    const highWaterMeters = input.highWaterMeters as number;
    const lowWaterMeters = input.lowWaterMeters as number;
    if (highWaterMeters < lowWaterMeters)
      simpleError(
        "highWaterMeters",
        "High water must not be below low water.",
        "invalid_levels",
      );
    return {
      tideHeightMeters:
        lowWaterMeters +
        (highWaterMeters - lowWaterMeters) *
          ((Math.cos((Math.PI * (input.hoursFromHigh as number)) / 6) + 1) / 2),
    };
  },
  description:
    "Interpolate tide height on a cosine curve from heightM = lowWaterMeters + (highWaterMeters - lowWaterMeters) * (cos(PI * hoursFromHigh / 6) + 1) / 2.",
  id: "sailing/tide-height-at-time",
  inputs: [
    {
      description: "Height of the high water.",
      id: "highWaterMeters",
      kind: "number",
      label: "High water",
      unit: "m",
    },
    {
      description: "Hours elapsed since high water, between 0 and 6.",
      id: "hoursFromHigh",
      kind: "number",
      label: "Hours from high water",
      maximum: 6,
      minimum: 0,
      unit: "h",
    },
    {
      description: "Height of the low water.",
      id: "lowWaterMeters",
      kind: "number",
      label: "Low water",
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Predicted tide height at the given time.",
      format: "length-m",
      id: "tideHeightMeters",
      kind: "number",
      label: "Tide height",
      unit: "m",
    },
  ],
  title: "Tide Height Cosine Curve",
});
export const runTideHeightAtTime = tideHeightAtTimeTool.execute;
export default tideHeightAtTimeTool;
