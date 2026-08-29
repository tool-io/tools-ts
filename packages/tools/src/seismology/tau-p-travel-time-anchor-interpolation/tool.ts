import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const tauPTravelTimeAnchorInterpolationExample = {
  input: {
    anchorDistancesDeg: [30, 40],
    anchorTimesSeconds: [336, 406],
    targetDistanceDeg: 35,
  },
  output: { travelTimeSeconds: 371, slownessAtTarget: 7 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const tauPTravelTimeAnchorInterpolationTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ anchorDistancesDeg, anchorTimesSeconds, targetDistanceDeg }) => {
      const D = anchorDistancesDeg as unknown[];
      const T = anchorTimesSeconds as unknown[];
      if (
        !Array.isArray(D) ||
        !Array.isArray(T) ||
        D.length !== T.length ||
        D.length < 2
      )
        simpleError(
          "anchorDistancesDeg",
          "Provide matching ascending anchors.",
        );
      const d = D as number[];
      const t = T as number[];
      if (targetDistanceDeg < d[0] || targetDistanceDeg > d[d.length - 1])
        simpleError("targetDistanceDeg", "Target outside anchor range.");
      let i = 1;
      while (i < d.length && d[i] < targetDistanceDeg) i++;
      const w = (targetDistanceDeg - d[i - 1]) / (d[i] - d[i - 1]);
      return {
        travelTimeSeconds: t[i - 1] + w * (t[i] - t[i - 1]),
        slownessAtTarget: (t[i] - t[i - 1]) / (d[i] - d[i - 1]),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Linearly interpolate P travel time between supplied distance anchors.",
  id: "seismology/tau-p-travel-time-anchor-interpolation",
  inputs: [
    {
      description: "Anchor distances (ascending).",
      id: "anchorDistancesDeg",
      kind: "numberList",
      label: "Δ_i",
    },
    {
      description: "Travel times at anchors.",
      id: "anchorTimesSeconds",
      kind: "numberList",
      label: "t_i",
    },
    {
      minimum: 0,
      description: "Target distance.",
      id: "targetDistanceDeg",
      kind: "number",
      label: "Δ*",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Interpolated travel time.",
      id: "travelTimeSeconds",
      kind: "number",
      label: "t(Δ*)",
      unit: "s",
    },
    {
      description: "Local segment slowness.",
      id: "slownessAtTarget",
      kind: "number",
      label: "dt/dΔ",
      unit: "s/°",
    },
  ],
  title: "Tau-P Travel Time Anchor Interpolation Calculator",
});
export const runTauPTravelTimeAnchorInterpolation =
  tauPTravelTimeAnchorInterpolationTool.execute;
export { tauPTravelTimeAnchorInterpolationExample as example };
export default tauPTravelTimeAnchorInterpolationTool;
