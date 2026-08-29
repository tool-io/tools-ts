import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const firstMotionPolarityBeachballQuadrantPickerExample = {
  input: { compressionalCount: 14, dilatationalCount: 10, nodalCount: 6 },
  output: {
    compressionalPercent: 58.333333333333336,
    callRatePercent: 80,
    quadrantQuality: "both quadrants sampled",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const firstMotionPolarityBeachballQuadrantPickerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ compressionalCount, dilatationalCount, nodalCount }) => {
      const total = compressionalCount + dilatationalCount + nodalCount;
      if (total === 0)
        simpleError("compressionalCount", "Provide at least one reading.");
      const called = compressionalCount + dilatationalCount;
      const compressionalPercent =
        (compressionalCount / Math.max(called, 1)) * 100;
      const callRatePercent = (called / total) * 100;
      const quadrantQuality =
        callRatePercent < 50
          ? "sparse"
          : compressionalCount > 0 && dilatationalCount > 0
            ? "both quadrants sampled"
            : "single-quadrant only";
      return { compressionalPercent, callRatePercent, quadrantQuality };
    })(input as never) as Record<string, unknown>,
  description:
    "Summarize P-wave first-motion polarity statistics into beachball quadrant occupancy.",
  id: "seismology/first-motion-polarity-beachball-quadrant-picker",
  inputs: [
    {
      minimum: 0,
      description: "Number of up (compression) readings.",
      id: "compressionalCount",
      kind: "integer",
      label: "n_up",
    },
    {
      minimum: 0,
      description: "Number of down (dilatation) readings.",
      id: "dilatationalCount",
      kind: "integer",
      label: "n_down",
    },
    {
      minimum: 0,
      description: "Readings too near nodal planes to call.",
      id: "nodalCount",
      kind: "integer",
      label: "n_nodal",
    },
  ],
  outputs: [
    {
      description: "Share of compressional readings among called polarities.",
      id: "compressionalPercent",
      kind: "number",
      label: "+%",
      unit: "%",
    },
    {
      description: "Fraction of readings usable for mechanism.",
      id: "callRatePercent",
      kind: "number",
      label: "Call %",
      unit: "%",
    },
    {
      description: "Quadrant sampling quality.",
      id: "quadrantQuality",
      kind: "string",
      label: "Quality",
    },
  ],
  title: "First Motion Polarity Beachball Quadrant Picker",
});
export const runFirstMotionPolarityBeachballQuadrantPicker =
  firstMotionPolarityBeachballQuadrantPickerTool.execute;
export { firstMotionPolarityBeachballQuadrantPickerExample as example };
export default firstMotionPolarityBeachballQuadrantPickerTool;
