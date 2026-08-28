import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const lidarRangeEquationExample = {
  input: { peakPowerWatts: 100, reflectivityFraction: 0.25 },
} satisfies ToolExample<{
  readonly linkConstantM?: number;
  readonly peakPowerWatts: number;
  readonly reflectivityFraction: number;
}>;

export const lidarRangeEquationTool = createSimpleTool({
  id: "electronics/lidar-range-equation",
  title: "Lidar Range Estimate",
  description:
    "Estimate lidar return range with a simplified link model rangeMeters = linkConstantM * sqrt(peakPowerWatts * reflectivityFraction), where linkConstantM folds geometry, aperture, and detector terms into one calibrated constant (default 1000).",
  inputs: [
    {
      description: "Transmitted laser peak power.",
      id: "peakPowerWatts",
      kind: "number",
      label: "Peak Power",
      unit: "W",
    },
    {
      description: "Target surface reflectivity fraction between zero and one.",
      id: "reflectivityFraction",
      kind: "number",
      label: "Reflectivity",
      maximum: 1,
      minimum: 0,
    },
    {
      default: 1000,
      description:
        "Calibrated link constant in meters per sqrt(watt); must be positive.",
      id: "linkConstantM",
      kind: "number",
      label: "Link Constant",
      required: false,
      unit: "m",
    },
  ],
  outputs: [
    {
      description: "Estimated operating range.",
      id: "estimatedRangeMeters",
      kind: "number",
      label: "Range",
      unit: "m",
    },
  ],
  calculate: (input) => {
    const peakPowerWatts = input.peakPowerWatts as number;
    const reflectivityFraction = input.reflectivityFraction as number;
    const linkConstantM = input.linkConstantM as number;
    if (!(peakPowerWatts > 0))
      simpleError("peakPowerWatts", "Peak power must be positive.");
    if (!(linkConstantM > 0))
      simpleError("linkConstantM", "Link constant must be positive.");
    return {
      estimatedRangeMeters:
        linkConstantM * Math.sqrt(peakPowerWatts * reflectivityFraction),
    };
  },
});
export const runLidarRangeEquation = lidarRangeEquationTool.execute;
export default lidarRangeEquationTool;
