import {
  simpleError,
  aligned,
  bounded,
  sum,
  positive,
  nonnegative,
  binary,
  mean,
  shape,
  finite,
  unique,
} from "../banking/batch45-shared.js";
import { calculatePearsonCorrelation as pearson } from "../statistics/pearson-correlation/tool.js";
import { giniCoefficient } from "../statistics/gini-coefficient/tool.js";
export * from "../banking/batch45-shared.js";
export const surveyRatio = (
  numerators: readonly number[],
  denominators: readonly number[],
  scale: number,
): {
  observedPooledRate: number;
  observedNumeratorTotal: number;
  observedDenominatorTotal: number;
} => {
  aligned(numerators, denominators, "strata");
  if (!numerators.length)
    simpleError("strata", "Nonempty independently aligned observed strata.");
  numerators.forEach((v) => nonnegative(v, "numerator"));
  denominators.forEach((v) => nonnegative(v, "denominator"));
  const n = sum(numerators),
    d = positive(sum(denominators), "denominator");
  return {
    observedPooledRate: finite((scale * n) / d),
    observedNumeratorTotal: n,
    observedDenominatorTotal: d,
  };
};
export const scoreEvidence = (
  scores: readonly number[],
  weights: readonly number[],
  known: readonly number[],
  domainCount = 3,
  allowSignedScores = false,
): {
  knownWeightedScore: number;
  unknownWeightFraction: number;
  unknownCriterionIndices: number[];
} => {
  if (scores.length !== domainCount)
    simpleError(
      "criteria",
      `Exactly ${domainCount} independently declared/calibrated rubric domains.`,
    );
  aligned(scores, weights, "weights");
  aligned(scores, known, "known");
  scores.forEach((v) => {
    if (!allowSignedScores && (v < 0 || v > 100))
      simpleError("score", "0–100 score.");
  });
  weights.forEach((v) => nonnegative(v, "weight"));
  binary(known, "known");
  const t = positive(sum(weights), "weight"),
    k = positive(sum(weights.map((v, i) => v * known[i])), "knownweight");
  return {
    knownWeightedScore:
      sum(scores.map((v, i) => v * weights[i] * known[i])) / k,
    unknownWeightFraction: sum(weights.map((v, i) => v * (1 - known[i]))) / t,
    unknownCriterionIndices: known.flatMap((v, i) => (v ? [] : [i])),
  };
};
export const graph = (
  a: readonly (readonly number[])[],
  directed = false,
): number => {
  const n = a.length;
  if (n < 2 || n > 32 || shape(a, "adjacency") !== n)
    simpleError("graph", "Square explicit adjacency for 2–32 nodes.");
  a.forEach((r, i) =>
    r.forEach((v, j) => {
      bounded(v, "edge", 0, 1);
      if ((i === j && v) || (!directed && v !== a[j][i]))
        simpleError(
          "graph",
          "No self-loops; undirected observations must be symmetric.",
        );
    }),
  );
  return n;
};
export const sampleIncome = (values: readonly number[]): number => {
  if (!values.length)
    simpleError("income", "Nonempty observed compatible income sample.");
  values.forEach((v) => nonnegative(v, "income"));
  return positive(sum(values), "totalincome");
};
export const shares = (counts: readonly number[]): number[] => {
  if (!counts.length) simpleError("counts", "Actual nonempty category counts.");
  counts.forEach((v) => nonnegative(v, "count"));
  const t = positive(sum(counts), "total");
  return counts.map((v) => v / t);
};
export const giniValue = (values: readonly number[]): number => {
  sampleIncome(values);
  return finite(giniCoefficient(values));
};
export const correlationKnown = (
  ids: readonly string[],
  x: readonly number[],
  y: readonly number[],
  known: readonly number[],
): {
  observedKnownCorrelation: number;
  includedCallerIds: string[];
  unknownCallerIds: string[];
} => {
  unique(ids, "pairs");
  [x, y, known].forEach((v) => aligned(ids, v, "pairs"));
  binary(known, "known");
  const xx = x.filter((_, i) => known[i]),
    yy = y.filter((_, i) => known[i]),
    r = pearson(xx, yy);
  if (r === null)
    simpleError(
      "pairs",
      "At least two independently known actual matched pairs with nonzero marginal variances.",
    );
  return {
    observedKnownCorrelation: r,
    includedCallerIds: ids.filter((_, i) => known[i]),
    unknownCallerIds: ids.filter((_, i) => !known[i]),
  };
};
