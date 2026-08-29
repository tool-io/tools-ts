import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const deaggregationMeanMagDistEpsilonExample = {
  input: {
    magnitudes: [6, 7],
    distancesKm: [10, 30],
    epsilons: [-0.5, 0.5],
    weights: [0.75, 0.25],
  },
  output: { meanMagnitude: 6.25, meanDistanceKm: 15, meanEpsilon: -0.25 },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const deaggregationMeanMagDistEpsilonTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ magnitudes, distancesKm, epsilons, weights }) => {
      const lists = [magnitudes, distancesKm, epsilons, weights] as unknown[];
      if (
        lists.some((l) => !Array.isArray(l)) ||
        new Set(lists.map((l) => (l as number[]).length)).size !== 1
      )
        simpleError(
          "weights",
          "All four lists must be present with equal length.",
        );
      const W = (weights as number[]).reduce((a, b) => a + b, 0);
      if ((weights as number[]).some((weight) => weight < 0))
        simpleError("weights", "Weights cannot be negative.");
      if ((distancesKm as number[]).some((distance) => distance < 0))
        simpleError("distancesKm", "Distances cannot be negative.");
      if (W <= 0)
        simpleError("weights", "Weights must sum to a positive value.");
      const wm = (xs: number[]) =>
        xs.reduce((a, x, i) => a + x * (weights as number[])[i], 0) / W;
      return {
        meanMagnitude: wm(magnitudes as number[]),
        meanDistanceKm: wm(distancesKm as number[]),
        meanEpsilon: wm(epsilons as number[]),
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Weighted mean magnitude, distance, and epsilon from deaggregation bins.",
  id: "seismology/deaggregation-mean-mag-dist-epsilon",
  inputs: [
    {
      description: "Bin mean magnitudes.",
      id: "magnitudes",
      kind: "numberList",
      label: "M_i",
    },
    {
      description: "Bin mean distances.",
      id: "distancesKm",
      kind: "numberList",
      label: "R_i",
    },
    {
      description: "Bin mean epsilons.",
      id: "epsilons",
      kind: "numberList",
      label: "ε_i",
    },
    {
      description: "Bin fractional contributions.",
      id: "weights",
      kind: "numberList",
      label: "w_i",
    },
  ],
  outputs: [
    {
      description: "Contribution-weighted mean magnitude.",
      id: "meanMagnitude",
      kind: "number",
      label: "M̄",
    },
    {
      description: "Weighted mean distance.",
      id: "meanDistanceKm",
      kind: "number",
      label: "R̄",
      unit: "km",
    },
    {
      description: "Weighted mean epsilon.",
      id: "meanEpsilon",
      kind: "number",
      label: "ε̄",
    },
  ],
  title: "Deaggregation Mean Mag Dist Epsilon Calculator",
});
export const runDeaggregationMeanMagDistEpsilon =
  deaggregationMeanMagDistEpsilonTool.execute;
export { deaggregationMeanMagDistEpsilonExample as example };
export default deaggregationMeanMagDistEpsilonTool;
