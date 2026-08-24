import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HandCountClusterVarianceInput = {
  readonly clusterMeans: number[];
  readonly pooledWithinStd: number;
};

export type HandCountClusterVarianceOutput = {
  readonly betweenClusterVariance: number;
  readonly cvPercent: number;
  readonly minGapOverStd: number;
  readonly plausiblyDistinctHands: boolean;
};

export const calculateHandCountClusterVariance = (
  input: HandCountClusterVarianceInput,
): HandCountClusterVarianceOutput => {
  if (input.clusterMeans.length < 2)
    return simpleError(
      "clusterMeans",
      "Provide at least two cluster means (one per proposed hand).",
      "invalid_clusters",
    );
  if (!input.clusterMeans.every((value) => Number.isFinite(value) && value > 0))
    return simpleError(
      "clusterMeans",
      "Cluster means must be greater than zero.",
      "invalid_clusters",
    );
  if (!(Number.isFinite(input.pooledWithinStd) && input.pooledWithinStd > 0))
    return simpleError(
      "pooledWithinStd",
      "The pooled within-cluster standard deviation must be greater than zero.",
      "invalid_std",
    );
  const count = input.clusterMeans.length;
  const directSum = input.clusterMeans.reduce(
    (total, value) => total + value,
    0,
  );
  let mean = directSum / count;
  if (!Number.isFinite(mean)) {
    mean = input.clusterMeans[0];
    for (let index = 1; index < count; index += 1)
      mean += (input.clusterMeans[index] - mean) / (index + 1);
  }
  const directSquaredDeviationSum = input.clusterMeans.reduce(
    (total, value) => total + (value - mean) ** 2,
    0,
  );
  let betweenClusterVariance = directSquaredDeviationSum / count;
  if (!Number.isFinite(betweenClusterVariance)) {
    const maximumDeviation = input.clusterMeans.reduce(
      (maximum, value) => Math.max(maximum, Math.abs(value - mean)),
      0,
    );
    const scaledSquareMean =
      input.clusterMeans.reduce(
        (total, value) => total + ((value - mean) / maximumDeviation) ** 2,
        0,
      ) / count;
    betweenClusterVariance =
      maximumDeviation * (maximumDeviation * scaledSquareMean);
  }
  const cvPercent = (Math.sqrt(betweenClusterVariance) / mean) * 100;
  const sorted = [...input.clusterMeans].sort((a, b) => a - b);
  let minGap = sorted[1] - sorted[0];
  for (let index = 2; index < count; index += 1) {
    const gap = sorted[index] - sorted[index - 1];
    if (gap < minGap) minGap = gap;
  }
  const minGapOverStd = minGap / input.pooledWithinStd;
  if (
    !Number.isFinite(mean) ||
    !Number.isFinite(betweenClusterVariance) ||
    !Number.isFinite(cvPercent) ||
    !Number.isFinite(minGapOverStd)
  )
    return simpleError(
      "clusterMeans",
      "The measurements are outside the representable calculation range.",
      "invalid_clusters",
    );
  return {
    betweenClusterVariance,
    cvPercent,
    minGapOverStd,
    plausiblyDistinctHands: minGapOverStd >= 2,
  };
};

export const handCountClusterVarianceExample = {
  input: { clusterMeans: [10.2, 11.4, 10.6], pooledWithinStd: 0.3 },
  output: {
    betweenClusterVariance: 0.2488888888888893,
    cvPercent: 4.64802159847695,
    minGapOverStd: 1.3333333333333346,
    plausiblyDistinctHands: false,
  },
} satisfies ToolExample<
  HandCountClusterVarianceInput,
  HandCountClusterVarianceOutput
>;

export const handCountClusterVarianceTool = createSimpleTool({
  id: "paleography/hand-count-cluster-variance",
  title: "Hand Count Cluster Variance",
  description:
    "Test whether proposed hands are plausibly distinct under the stated rule: report the population variance and coefficient of variation of the per-hand means, the smallest gap between neighbouring means divided by the pooled within-hand standard deviation, and treat gaps of at least two standard deviations as distinct hands.",
  inputs: [
    {
      description:
        "One mean measurement per proposed hand (e.g. mean x-height).",
      id: "clusterMeans",
      kind: "numberList",
      label: "Cluster means",
    },
    {
      description:
        "Positive pooled within-hand standard deviation of that measurement.",
      id: "pooledWithinStd",
      kind: "number",
      label: "Within std",
    },
  ],
  outputs: [
    {
      description: "Population variance across the cluster means.",
      id: "betweenClusterVariance",
      kind: "number",
      label: "Between variance",
    },
    {
      description: "Coefficient of variation of the means in percent.",
      id: "cvPercent",
      kind: "number",
      label: "CV %",
    },
    {
      description: "Smallest neighbouring-means gap over pooled within std.",
      id: "minGapOverStd",
      kind: "number",
      label: "Min gap / std",
    },
    {
      description:
        "True when every neighbouring gap is at least two within-stds.",
      id: "plausiblyDistinctHands",
      kind: "boolean",
      label: "Distinct hands",
    },
  ],
  calculate: (input) =>
    calculateHandCountClusterVariance({
      clusterMeans: input.clusterMeans as number[],
      pooledWithinStd: input.pooledWithinStd as number,
    }),
});

export const runHandCountClusterVariance = handCountClusterVarianceTool.execute;
export default handCountClusterVarianceTool;
