import type { ToolExample } from "../../core/example.js";
import { toolResourceLimits } from "../../core/limits.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const catalogDepthHistogramBinnerExample = {
  input: { depthsKm: [2, 7, 12, 45, -1], binWidthKm: 5, maxDepthKm: 20 },
  output: { binCounts: [1, 1, 1, 0], belowZeroCount: 1, aboveMaxCount: 1 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const catalogDepthHistogramBinnerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ depthsKm, binWidthKm, maxDepthKm }) => {
      const zs = depthsKm as unknown[];
      const w = binWidthKm ?? 5;
      const zMax = maxDepthKm ?? 40;
      if (!Array.isArray(zs) || zs.length === 0 || w <= 0 || zMax <= 0)
        simpleError("depthsKm", "Provide depths and a positive width.");
      const bins = Math.ceil(zMax / w);
      if (bins > toolResourceLimits.generatedValues)
        simpleError(
          "binWidthKm",
          `Histogram cannot exceed ${toolResourceLimits.generatedValues} bins.`,
          "resource_limit_exceeded",
        );
      const binCounts = Array(bins).fill(0);
      let belowZeroCount = 0;
      let aboveMaxCount = 0;
      for (const raw of zs as number[]) {
        if (raw < 0) belowZeroCount++;
        else if (raw >= zMax) aboveMaxCount++;
        else binCounts[Math.floor(raw / w)]++;
      }
      return { binCounts, belowZeroCount, aboveMaxCount };
    })(input as never) as Record<string, unknown>,
  description:
    "Bin hypocentral depths into fixed-width bins with an out-of-range tail count.",
  id: "seismology/catalog-depth-histogram-binner",
  inputs: [
    {
      description: "Hypocentral depths.",
      id: "depthsKm",
      kind: "numberList",
      label: "z_i",
    },
    {
      default: 5,
      description: "Bin width.",
      id: "binWidthKm",
      kind: "number",
      label: "Δz",
      unit: "km",
    },
    {
      default: 40,
      description: "Upper histogram edge.",
      id: "maxDepthKm",
      kind: "number",
      label: "z_max",
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Counts per bin from zero depth upward.",
      id: "binCounts",
      kind: "numberList",
      label: "counts",
    },
    {
      description: "Depths above the surface datum (fixed depths).",
      id: "belowZeroCount",
      kind: "integer",
      label: "n<0",
    },
    {
      description: "Depths beyond the upper edge.",
      id: "aboveMaxCount",
      kind: "integer",
      label: "n>max",
    },
  ],
  title: "Catalog Depth Histogram Binner",
});
export const runCatalogDepthHistogramBinner =
  catalogDepthHistogramBinnerTool.execute;
export { catalogDepthHistogramBinnerExample as example };
export default catalogDepthHistogramBinnerTool;
