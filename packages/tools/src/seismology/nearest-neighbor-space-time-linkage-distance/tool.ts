import type { ToolExample } from "../../core/example.js";
import { toolResourceLimits } from "../../core/limits.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const nearestNeighborSpaceTimeLinkageDistanceExample = {
  input: {
    eastingsKm: [0, 3],
    northingsKm: [0, 4],
    epochDays: [0, 1],
    timeScaleKm: 10,
  },
  output: {
    nearestDistancesKm: [11.180339887498949, 11.180339887498949],
    globalMeanKm: 11.180339887498949,
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const nearestNeighborSpaceTimeLinkageDistanceTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ eastingsKm, northingsKm, epochDays, timeScaleKm }) => {
      const X = eastingsKm as unknown[];
      const Y = northingsKm as unknown[];
      const T = epochDays as unknown[];
      if (
        !Array.isArray(X) ||
        !Array.isArray(Y) ||
        !Array.isArray(T) ||
        X.length !== Y.length ||
        X.length !== T.length ||
        X.length < 2
      )
        simpleError(
          "eastingsKm",
          "Provide matching lists with at least two events.",
        );
      if (timeScaleKm <= 0)
        simpleError("timeScaleKm", "Time scale must be positive.");
      const n = X.length;
      if (n * (n - 1) > toolResourceLimits.iterations)
        simpleError(
          "eastingsKm",
          `Pair comparisons cannot exceed ${toolResourceLimits.iterations}.`,
          "resource_limit_exceeded",
        );
      const nearestDistancesKm: number[] = [];
      let sum = 0;
      for (let i = 0; i < n; i++) {
        let best = Infinity;
        for (let j = 0; j < n; j++) {
          if (i === j) continue;
          const d = Math.hypot(
            (X as number[])[i] - (X as number[])[j],
            (Y as number[])[i] - (Y as number[])[j],
            ((T as number[])[i] - (T as number[])[j]) * timeScaleKm,
          );
          best = Math.min(best, d);
        }
        nearestDistancesKm.push(best === Infinity ? 0 : best);
        sum += best === Infinity ? 0 : best;
      }
      return { nearestDistancesKm, globalMeanKm: sum / n };
    })(input as never) as Record<string, unknown>,
  description:
    "Normalized nearest-neighbor distance for each event against all others.",
  id: "seismology/nearest-neighbor-space-time-linkage-distance",
  inputs: [
    {
      description: "Event eastings.",
      id: "eastingsKm",
      kind: "numberList",
      label: "x_i",
    },
    {
      description: "Event northings.",
      id: "northingsKm",
      kind: "numberList",
      label: "y_i",
    },
    {
      description: "Event epochs in days.",
      id: "epochDays",
      kind: "numberList",
      label: "t_i",
    },
    {
      minimum: 0,
      description: "Time-to-space scale (km per day).",
      id: "timeScaleKm",
      kind: "number",
      label: "τ_v",
    },
  ],
  outputs: [
    {
      description: "Nearest-neighbor distance per event.",
      id: "nearestDistancesKm",
      kind: "numberList",
      label: "d_nn",
    },
    {
      description: "Mean NN distance.",
      id: "globalMeanKm",
      kind: "number",
      label: "d̄",
      unit: "km",
    },
  ],
  title: "Nearest Neighbor Space Time Linkage Distance",
});
export const runNearestNeighborSpaceTimeLinkageDistance =
  nearestNeighborSpaceTimeLinkageDistanceTool.execute;
export { nearestNeighborSpaceTimeLinkageDistanceExample as example };
export default nearestNeighborSpaceTimeLinkageDistanceTool;
