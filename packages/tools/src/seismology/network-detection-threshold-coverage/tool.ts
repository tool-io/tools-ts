import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const networkDetectionThresholdCoverageExample = {
  input: { stationSpacingKm: 20 },
  output: { detectionRadiusKm: 30, minimumMagnitude: 2.9771212547196626 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const networkDetectionThresholdCoverageTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ stationSpacingKm }) => {
      if (!(stationSpacingKm > 0))
        simpleError("stationSpacingKm", "Station spacing must be positive.");
      const detectionRadiusKm = 1.5 * stationSpacingKm;
      return {
        detectionRadiusKm,
        minimumMagnitude: 1.5 + Math.log10(detectionRadiusKm),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Illustrative magnitude-of-completeness screening relation M_min ≈ 1.5 + log₁₀(r/km) using a detection radius of 1.5 times station spacing; it is not a calibrated network threshold.",
  id: "seismology/network-detection-threshold-coverage",
  inputs: [
    {
      minimum: 0,
      description: "Typical station spacing.",
      id: "stationSpacingKm",
      kind: "number",
      label: "d",
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Assumed detection radius (= 1.5×spacing).",
      id: "detectionRadiusKm",
      kind: "number",
      label: "r",
      unit: "km",
    },
    {
      description: "Completeness magnitude at that radius.",
      id: "minimumMagnitude",
      kind: "number",
      label: "M_min",
    },
  ],
  title: "Network Detection Threshold Coverage Calculator",
});
export const runNetworkDetectionThresholdCoverage =
  networkDetectionThresholdCoverageTool.execute;
export { networkDetectionThresholdCoverageExample as example };
export default networkDetectionThresholdCoverageTool;
