import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WaferWarpInput = {
  readonly peakDeviationUm: number;
  readonly valleyDeviationUm: number;
};

export type WaferWarpOutput = {
  readonly warpUm: number;
};

export const waferWarpExample = {
  input: { peakDeviationUm: 2.5, valleyDeviationUm: -1.5 },
  output: { warpUm: 4 },
} satisfies ToolExample<WaferWarpInput, WaferWarpOutput>;

export const waferWarpTool = createSimpleTool({
  calculate: (input) => {
    const peakDeviationUm = input.peakDeviationUm as number;
    const valleyDeviationUm = input.valleyDeviationUm as number;
    if (peakDeviationUm < valleyDeviationUm)
      simpleError(
        "peakDeviationUm",
        "Peak deviation must be greater than or equal to valley deviation.",
        "invalid_extrema_order",
      );
    return { warpUm: peakDeviationUm - valleyDeviationUm };
  },
  description:
    "Compute wafer warp as the absolute difference between the largest positive and negative surface deviations.",
  id: "semiconductor/wafer-warp",
  inputs: [
    {
      description: "Largest positive deviation from the reference plane.",
      id: "peakDeviationUm",
      kind: "number",
      label: "Peak deviation",
      unit: "µm",
    },
    {
      description: "Largest negative deviation from the reference plane.",
      id: "valleyDeviationUm",
      kind: "number",
      label: "Valley deviation",
      unit: "µm",
    },
  ],
  outputs: [
    {
      description: "Peak-to-valley warp.",
      id: "warpUm",
      kind: "number",
      label: "Warp",
      unit: "µm",
    },
  ],
  title: "Wafer Warp Calculator",
});
export const runWaferWarp = waferWarpTool.execute;
export default waferWarpTool;
