import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const doubleDifferencePairMeanOffsetSummaryExample = {
  input: {
    offsetsEastKm: [3, 4],
    offsetsNorthKm: [0, 0],
    offsetsDownKm: [0, 0],
  },
  output: {
    meanSeparationKm: 3.5,
    rmsHorizontalKm: 3.5355339059327378,
    pairCount: 2,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const doubleDifferencePairMeanOffsetSummaryTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ offsetsEastKm, offsetsNorthKm, offsetsDownKm }) => {
      const x = offsetsEastKm as unknown[];
      const y = offsetsNorthKm as unknown[];
      const z = offsetsDownKm as unknown[];
      const n = Array.isArray(x) ? x.length : 0;
      if (
        !Array.isArray(x) ||
        !Array.isArray(y) ||
        !Array.isArray(z) ||
        n !== y.length ||
        n !== z.length ||
        n === 0
      )
        simpleError(
          "offsetsEastKm",
          "Provide equal-length non-empty pair lists.",
        );
      let sum = 0;
      let sh = 0;
      for (let i = 0; i < n; i++) {
        const dx = (x as number[])[i];
        const dy = (y as number[])[i];
        const dz = (z as number[])[i];
        sum += Math.hypot(dx, dy, dz);
        sh += dx * dx + dy * dy;
      }
      return {
        meanSeparationKm: sum / n,
        rmsHorizontalKm: Math.sqrt(sh / n),
        pairCount: n,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Summarize double-difference relocation pairs: mean and RMS inter-event separation.",
  id: "seismology/double-difference-pair-mean-offset-summary",
  inputs: [
    {
      description: "Pair east offsets.",
      id: "offsetsEastKm",
      kind: "numberList",
      label: "Δx",
    },
    {
      description: "Pair north offsets.",
      id: "offsetsNorthKm",
      kind: "numberList",
      label: "Δy",
    },
    {
      description: "Pair depth offsets (positive down).",
      id: "offsetsDownKm",
      kind: "numberList",
      label: "Δz",
    },
  ],
  outputs: [
    {
      description: "Mean 3-D pair separation.",
      id: "meanSeparationKm",
      kind: "number",
      label: "d̄",
      unit: "km",
    },
    {
      description: "RMS horizontal offset.",
      id: "rmsHorizontalKm",
      kind: "number",
      label: "rms_h",
      unit: "km",
    },
    {
      description: "Number of pairs.",
      id: "pairCount",
      kind: "integer",
      label: "N",
    },
  ],
  title: "Double Difference Pair Mean Offset Summary",
});
export const runDoubleDifferencePairMeanOffsetSummary =
  doubleDifferencePairMeanOffsetSummaryTool.execute;
export { doubleDifferencePairMeanOffsetSummaryExample as example };
export default doubleDifferencePairMeanOffsetSummaryTool;
