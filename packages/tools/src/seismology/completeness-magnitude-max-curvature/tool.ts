import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const completenessMagnitudeMaxCurvatureExample = {
  input: { binCounts: [2, 5, 9, 14, 11, 6, 3], binStartMag: 0, binWidth: 0.5 },
  output: { completenessMagnitude: 1.5, peakCount: 14 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const completenessMagnitudeMaxCurvatureTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ binCounts, binStartMag, binWidth }) => {
      const ns = binCounts as unknown[];
      if (!Array.isArray(ns) || ns.length === 0)
        simpleError("binCounts", "Provide histogram counts.");
      const arr = ns as number[];
      if (arr.some((count) => count < 0))
        simpleError("binCounts", "Histogram counts cannot be negative.");
      let best = 0;
      for (let i = 1; i < arr.length; i++) if (arr[i] > arr[best]) best = i;
      const start = binStartMag ?? 0;
      const width = binWidth ?? 0.1;
      if (!(width > 0)) simpleError("binWidth", "Bin width must be positive.");
      return {
        completenessMagnitude: start + best * width,
        peakCount: arr[best],
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Mc from the maximum-curvature (mode) of the binned frequency-magnitude distribution.",
  id: "seismology/completeness-magnitude-max-curvature",
  inputs: [
    {
      description: "Event counts per magnitude bin.",
      id: "binCounts",
      kind: "numberList",
      label: "n_i",
    },
    {
      default: 0,
      description: "Central magnitude of the first bin.",
      id: "binStartMag",
      kind: "number",
      label: "M₀",
    },
    {
      default: 0.1,
      description: "Bin width.",
      id: "binWidth",
      kind: "number",
      label: "ΔM",
    },
  ],
  outputs: [
    {
      description: "Magnitude of the modal bin.",
      id: "completenessMagnitude",
      kind: "number",
      label: "Mc",
    },
    {
      description: "Count in the modal bin.",
      id: "peakCount",
      kind: "number",
      label: "n_max",
    },
  ],
  title: "Completeness Magnitude Max Curvature Calculator",
});
export const runCompletenessMagnitudeMaxCurvature =
  completenessMagnitudeMaxCurvatureTool.execute;
export { completenessMagnitudeMaxCurvatureExample as example };
export default completenessMagnitudeMaxCurvatureTool;
