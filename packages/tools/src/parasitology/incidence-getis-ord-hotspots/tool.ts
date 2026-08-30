import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative, aligned } from "../shared.js";

export type Input = Readonly<{
  readonly siteIds: readonly string[];
  readonly incidenceValues: readonly number[];
  readonly spatialWeights: readonly (readonly number[])[];
  readonly hotspotZCutoff: number;
}>;
export type Output = Readonly<{
  readonly giStarZScores: readonly number[];
  readonly hotspotIds: readonly string[];
}>;
export const calculate = (input: Input): Output => {
  aligned(input.siteIds, input.incidenceValues, "siteIds");
  const n = input.siteIds.length;
  positive(input.hotspotZCutoff, "hotspotZCutoff");
  input.incidenceValues.forEach((v) => nonnegative(v, "incidenceValues"));
  if (
    n < 3 ||
    n > 128 ||
    new Set(input.siteIds).size !== n ||
    input.spatialWeights.length !== n ||
    input.spatialWeights.some(
      (row, i) =>
        row.length !== n ||
        row[i] <= 0 ||
        row.some((v) => !Number.isFinite(v) || v < 0),
    )
  )
    simpleError(
      "spatialWeights",
      "At least three distinct sites and aligned nonnegative weights including self weights required; at most 128 sites.",
    );
  const mean = input.incidenceValues.reduce((sum, v) => sum + v, 0) / n,
    sd = Math.sqrt(
      input.incidenceValues.reduce((sum, v) => sum + (v - mean) ** 2, 0) / n,
    );
  positive(sd, "incidenceValues");
  const giStarZScores = input.spatialWeights.map((row) => {
    const sumWeights = row.reduce((a, b) => a + b, 0),
      sumSquared = row.reduce((sum, v) => sum + v * v, 0),
      denominator =
        sd *
        Math.sqrt(Math.max(0, (n * sumSquared - sumWeights ** 2) / (n - 1)));
    positive(denominator, "spatialWeights");
    return (
      (row.reduce((sum, w, j) => sum + w * input.incidenceValues[j], 0) -
        mean * sumWeights) /
      denominator
    );
  });
  return {
    giStarZScores,
    hotspotIds: input.siteIds.filter(
      (_, i) => giStarZScores[i] >= input.hotspotZCutoff,
    ),
  };
};
export const exampleInput = {
  siteIds: ["A", "B", "C", "D"],
  incidenceValues: [0, 0, 10, 10],
  spatialWeights: [
    [1, 1, 0, 0],
    [1, 1, 0, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 1],
  ],
  hotspotZCutoff: 1.5,
} satisfies Input;
export const exampleOutput = {
  giStarZScores: [
    -1.7320508075688772, -1.7320508075688772, 1.7320508075688772,
    1.7320508075688772,
  ],
  hotspotIds: ["C", "D"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/incidence-getis-ord-hotspots",
  title: "Incidence Getis Ord Hotspots",
  description:
    "Compute local Getis–Ord Gi* standardized scores from supplied incidence and self-inclusive spatial weights; caller cutoff is not a multiple-testing correction.",
  inputs: [
    { id: "siteIds", label: "Site ids", kind: "stringList" },
    { id: "incidenceValues", label: "Incidence values", kind: "numberList" },
    { id: "spatialWeights", label: "Spatial weights", kind: "matrix" },
    { id: "hotspotZCutoff", label: "Hotspot z cutoff", kind: "number" },
  ],
  outputs: [
    { id: "giStarZScores", label: "Gi star z scores", kind: "numberList" },
    { id: "hotspotIds", label: "Hotspot ids", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      siteIds: value.siteIds as readonly string[],
      incidenceValues: value.incidenceValues as readonly number[],
      spatialWeights: value.spatialWeights as readonly (readonly number[])[],
      hotspotZCutoff: value.hotspotZCutoff as number,
    }),
});
export const run = tool.execute;
export default tool;
