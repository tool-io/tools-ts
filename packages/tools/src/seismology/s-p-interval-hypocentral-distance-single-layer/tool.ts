import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const sPIntervalHypocentralDistanceSingleLayerExample = {
  input: { spIntervalSeconds: 5 },
  output: {
    hypocentralDistanceKm: 42.92307692307692,
    pArrivalDelayS: 6.9230769230769225,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const sPIntervalHypocentralDistanceSingleLayerTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ spIntervalSeconds, vpKmS, vsKmS }) => {
      if (!(vpKmS > 0) || !(vsKmS > 0))
        simpleError("vpKmS", "P- and S-wave velocities must be positive.");
      const invDiff = 1 / vsKmS - 1 / vpKmS;
      if (invDiff <= 0) simpleError("vpKmS", "V_p must exceed V_s.");
      const hypocentralDistanceKm = spIntervalSeconds / invDiff;
      return {
        hypocentralDistanceKm,
        pArrivalDelayS: hypocentralDistanceKm / vpKmS,
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Hypocentral distance from the S-minus-P interval in a single-layer model: d = Δt / (1/V_s − 1/V_p).",
  id: "seismology/s-p-interval-hypocentral-distance-single-layer",
  inputs: [
    {
      minimum: 0,
      description: "S−P arrival-time interval.",
      id: "spIntervalSeconds",
      kind: "number",
      label: "Δt",
      unit: "s",
    },
    {
      default: 6.2,
      description: "P-wave speed.",
      id: "vpKmS",
      kind: "number",
      label: "V_p",
      unit: "km/s",
    },
    {
      default: 3.6,
      description: "S-wave speed.",
      id: "vsKmS",
      kind: "number",
      label: "V_s",
      unit: "km/s",
    },
  ],
  outputs: [
    {
      description: "Hypocentral (slant) distance.",
      id: "hypocentralDistanceKm",
      kind: "number",
      label: "d",
      unit: "km",
    },
    {
      description: "P travel time for that distance.",
      id: "pArrivalDelayS",
      kind: "number",
      label: "t_p",
      unit: "s",
    },
  ],
  title: "S-P Interval Hypocentral Distance Calculator",
});
export const runSPIntervalHypocentralDistanceSingleLayer =
  sPIntervalHypocentralDistanceSingleLayerTool.execute;
export { sPIntervalHypocentralDistanceSingleLayerExample as example };
export default sPIntervalHypocentralDistanceSingleLayerTool;
