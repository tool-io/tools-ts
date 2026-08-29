import type { ToolExample } from "../../core/example.js";
import { toolResourceLimits } from "../../core/limits.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const wadatiResidualHistogramBinnerExample = {
  input: { residualsSeconds: [0.1, 0.2, 0.3], binWidthSeconds: 0.25 },
  output: { binCenters: [0.125, 0.375], binCounts: [2, 1] },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const wadatiResidualHistogramBinnerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ residualsSeconds, binWidthSeconds }) => {
      const rs = residualsSeconds as unknown[];
      const w = binWidthSeconds ?? 0.25;
      if (!Array.isArray(rs) || rs.length === 0 || w <= 0)
        simpleError(
          "residualsSeconds",
          "Provide residuals and a positive width.",
        );
      const arr = rs as number[];
      let lo = Infinity;
      let hi = -Infinity;
      for (const r of arr) {
        lo = Math.min(lo, r);
        hi = Math.max(hi, r);
      }
      const firstBin = Math.floor(lo / w);
      const lastBin = Math.floor(hi / w);
      if (lastBin - firstBin + 1 > toolResourceLimits.generatedValues)
        simpleError(
          "binWidthSeconds",
          `Histogram cannot exceed ${toolResourceLimits.generatedValues} bins.`,
          "resource_limit_exceeded",
        );
      const binCenters: number[] = [];
      const binCounts: number[] = [];
      for (let b = firstBin; b <= lastBin; b++) {
        binCenters.push((b + 0.5) * w);
        binCounts.push(0);
      }
      for (const r of arr) binCounts[Math.floor(r / w) - firstBin]++;
      return { binCenters, binCounts };
    })(input as never) as Record<string, unknown>,
  description:
    "Bin station Wadati residuals into a fixed-width histogram with outlier tail capture.",
  id: "seismology/wadati-residual-histogram-binner",
  inputs: [
    {
      description: "Station S−P residuals.",
      id: "residualsSeconds",
      kind: "numberList",
      label: "r_i",
    },
    {
      default: 0.25,
      description: "Histogram bin width.",
      id: "binWidthSeconds",
      kind: "number",
      label: "Δr",
    },
  ],
  outputs: [
    {
      description: "Bin centers (ascending).",
      id: "binCenters",
      kind: "numberList",
      label: "centers",
    },
    {
      description: "Residual counts per bin.",
      id: "binCounts",
      kind: "numberList",
      label: "counts",
    },
  ],
  title: "Wadati Residual Histogram Binner",
});
export const runWadatiResidualHistogramBinner =
  wadatiResidualHistogramBinnerTool.execute;
export { wadatiResidualHistogramBinnerExample as example };
export default wadatiResidualHistogramBinnerTool;
