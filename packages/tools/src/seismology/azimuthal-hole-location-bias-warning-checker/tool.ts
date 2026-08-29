import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const azimuthalHoleLocationBiasWarningCheckerExample = {
  input: { maxGapDeg: 200, nearestStationKm: 15 },
  output: {
    biasLikely: true,
    advice:
      "Treat depths as weakly constrained; add stations opposite the gap.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const azimuthalHoleLocationBiasWarningCheckerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ maxGapDeg, nearestStationKm }) => {
      const biasLikely = maxGapDeg > 180 || nearestStationKm > 20;
      return {
        biasLikely,
        advice: biasLikely
          ? "Treat depths as weakly constrained; add stations opposite the gap."
          : "Azimuthal coverage adequate; standard uncertainty applies.",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Warn when the station azimuthal gap is wide enough to push hypocentres systematically into the gap.",
  id: "seismology/azimuthal-hole-location-bias-warning-checker",
  inputs: [
    {
      minimum: 0,
      description: "Largest azimuthal gap.",
      id: "maxGapDeg",
      kind: "number",
      label: "Gap",
      unit: "°",
    },
    {
      minimum: 0,
      description: "Nearest station distance.",
      id: "nearestStationKm",
      kind: "number",
      label: "d_near",
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Whether systematic location bias is expected.",
      id: "biasLikely",
      kind: "boolean",
      label: "Biased?",
    },
    {
      description: "Mitigation advice.",
      id: "advice",
      kind: "string",
      label: "Advice",
    },
  ],
  title: "Azimuthal Hole Location Bias Warning Checker",
});
export const runAzimuthalHoleLocationBiasWarningChecker =
  azimuthalHoleLocationBiasWarningCheckerTool.execute;
export { azimuthalHoleLocationBiasWarningCheckerExample as example };
export default azimuthalHoleLocationBiasWarningCheckerTool;
