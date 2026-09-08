import {
  simpleError,
  aligned,
  bounded,
  positive,
  nonnegative,
  sum,
  mean,
  binary,
  strictlyIncreasing,
  finite,
  daysBetween,
  unique,
} from "../sociology/batch46-shared.js";
export * from "../sociology/batch46-shared.js";
export const ownReference = (
  source: string,
  context: string,
  asOf: string,
): void => {
  if (
    !source.trim() ||
    !context.trim() ||
    Math.max(source.length, context.length) > 1024
  )
    simpleError(
      "reference",
      "Explicit bounded independently verified source/context.",
    );
  daysBetween(asOf, asOf);
};
export const shiftDate = (date: string, offset: number): string => {
  bounded(offset, "day-offset", -3652058, 3652058);
  const target = daysBetween("0001-01-01", date) + offset,
    max = daysBetween("0001-01-01", "9999-12-31");
  if (target < 0 || target > max)
    simpleError("date", "Result within Gregorian years 1–9999.");
  const first = (y: number, m = 1) =>
    String(y).padStart(4, "0") + "-" + String(m).padStart(2, "0") + "-01";
  let lo = 1,
    hi = 9999;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (daysBetween("0001-01-01", first(mid)) <= target) lo = mid;
    else hi = mid - 1;
  }
  let month = 1;
  while (
    month < 12 &&
    daysBetween("0001-01-01", first(lo, month + 1)) <= target
  )
    month++;
  const day = target - daysBetween("0001-01-01", first(lo, month)) + 1;
  return first(lo, month).slice(0, 8) + String(day).padStart(2, "0");
};
export const referenceInterpolation = (
  x: readonly number[],
  y: readonly number[],
  q: number,
): number => {
  aligned(x, y, "reference");
  strictlyIncreasing(x, "reference-x", 2);
  if (q < x[0] || q > x.at(-1)!)
    simpleError(
      "query",
      "No extrapolation beyond independently verified knots.",
    );
  if (q === x.at(-1)) return y.at(-1)!;
  const i = x.findIndex((v) => v > q) - 1;
  return finite(y[i] + ((y[i + 1] - y[i]) * (q - x[i])) / (x[i + 1] - x[i]));
};
export const percentileInterpolation = (
  x: readonly number[],
  p: readonly number[],
  q: number,
): number => {
  if (p.some((v, i) => v < 0 || v > 100 || (i > 0 && v < p[i - 1])))
    simpleError(
      "percentiles",
      "Actual monotonically nondecreasing 0–100 percentile knots in an independently matched age/cohort stratum.",
    );
  return referenceInterpolation(x, p, q);
};
export const itemTotals = (
  scores: readonly number[],
  known: readonly number[],
  maxima: readonly number[],
  minima: readonly number[],
  step = 1,
): {
  knownItemSum: number;
  minimumPossibleTotal: number;
  maximumPossibleTotal: number;
  unknownItemIndices: number[];
} => {
  aligned(scores, maxima, "items");
  aligned(scores, minima, "minima");
  aligned(scores, known, "known");
  binary(known, "known");
  scores.forEach((v, i) => {
    if (
      v < minima[i] ||
      v > maxima[i] ||
      (step > 0 && Math.abs(v / step - Math.round(v / step)) > 1e-10)
    )
      simpleError(
        "items",
        "Independent item codes in declared range and increment.",
      );
  });
  const k = sum(scores.map((v, i) => v * known[i]));
  return {
    knownItemSum: k,
    minimumPossibleTotal: k + sum(minima.map((v, i) => v * (1 - known[i]))),
    maximumPossibleTotal: k + sum(maxima.map((v, i) => v * (1 - known[i]))),
    unknownItemIndices: known.flatMap((v, i) => (v ? [] : [i])),
  };
};
export const peakWindow = (
  times: readonly number[],
  amplitudes: readonly number[],
  start: number,
  end: number,
  polarity: number,
): {
  sampledPeakTime: number;
  sampledPeakAmplitude: number;
  tiedSampledPeakTimes: number[];
} => {
  aligned(times, amplitudes, "waveform");
  strictlyIncreasing(times, "time", 2);
  if (end < start || ![1, -1].includes(polarity))
    simpleError(
      "window",
      "Ordered independently identified inclusive component window and polarity ±1.",
    );
  const ii = times.flatMap((t, i) => (t >= start && t <= end ? [i] : []));
  if (!ii.length)
    simpleError(
      "window",
      "Actual observed samples required in component window.",
    );
  const best = Math.max(...ii.map((i) => polarity * amplitudes[i]));
  if (best <= 0)
    simpleError(
      "component",
      "Actual selected-polarity component evidence required.",
    );
  const tied = ii.filter((i) => polarity * amplitudes[i] === best);
  return {
    sampledPeakTime: times[tied[0]],
    sampledPeakAmplitude: amplitudes[tied[0]],
    tiedSampledPeakTimes: tied.map((i) => times[i]),
  };
};
export const pairedChanges = (
  ids: readonly string[],
  before: readonly number[],
  after: readonly number[],
  known: readonly number[],
): {
  knownCallerIds: string[];
  unknownCallerIds: string[];
  signedKnownChanges: number[];
} => {
  unique(ids, "observations");
  [before, after, known].forEach((v) => aligned(ids, v, "pairs"));
  binary(known, "known");
  return {
    knownCallerIds: ids.filter((_, i) => known[i]),
    unknownCallerIds: ids.filter((_, i) => !known[i]),
    signedKnownChanges: before.flatMap((v, i) =>
      known[i] ? [finite(after[i] - v)] : [],
    ),
  };
};
export const referencePercentile = (
  x: readonly number[],
  weights: readonly number[],
  q: number,
): number => {
  aligned(x, weights, "reference");
  if (!x.length)
    simpleError(
      "reference",
      "Nonempty independently verified matched normative sample.",
    );
  weights.forEach((v) => nonnegative(v, "weight"));
  const t = positive(sum(weights), "weight");
  return (
    (100 * sum(x.map((v, i) => weights[i] * (v < q ? 1 : v === q ? 0.5 : 0)))) /
    t
  );
};
export const toothMap: Readonly<Record<string, string>> = Object.fromEntries([
  ...Array.from({ length: 8 }, (_, i) => [String(11 + i), String(8 - i)]),
  ...Array.from({ length: 8 }, (_, i) => [String(21 + i), String(9 + i)]),
  ...Array.from({ length: 8 }, (_, i) => [String(31 + i), String(24 - i)]),
  ...Array.from({ length: 8 }, (_, i) => [String(41 + i), String(25 + i)]),
  ...Array.from({ length: 5 }, (_, i) => [
    String(51 + i),
    String.fromCharCode(69 - i),
  ]),
  ...Array.from({ length: 5 }, (_, i) => [
    String(61 + i),
    String.fromCharCode(70 + i),
  ]),
  ...Array.from({ length: 5 }, (_, i) => [
    String(71 + i),
    String.fromCharCode(79 - i),
  ]),
  ...Array.from({ length: 5 }, (_, i) => [
    String(81 + i),
    String.fromCharCode(80 + i),
  ]),
]);
export const toothAudit = (
  ids: readonly string[],
  codes: readonly number[],
  known: readonly number[],
  primary: boolean,
): {
  decayedCount: number;
  missingOrExtractionCount: number;
  filledCount: number;
  knownIndexTotal: number;
  unknownToothIds: string[];
} => {
  unique(ids, "teeth");
  aligned(ids, codes, "codes");
  aligned(ids, known, "known");
  binary(known, "known");
  codes.forEach((v) => bounded(v, "status", 0, 3));
  if (
    ids.length > (primary ? 20 : 32) ||
    ids.some(
      (v) =>
        !Object.hasOwn(toothMap, v) ||
        Number(v[0]) < (primary ? 5 : 1) ||
        Number(v[0]) > (primary ? 8 : 4),
    )
  )
    simpleError(
      "teeth",
      "Distinct actual valid FDI-specific permanent/primary dentition IDs.",
    );
  const c = (status: number) =>
      codes.filter((v, i) => known[i] && v === status).length,
    d = c(1),
    m = c(2),
    f = c(3);
  return {
    decayedCount: d,
    missingOrExtractionCount: m,
    filledCount: f,
    knownIndexTotal: d + m + f,
    unknownToothIds: ids.filter((_, i) => !known[i]),
  };
};
export const knownRate = (
  ids: readonly string[],
  flags: readonly number[],
  known: readonly number[],
): {
  observedKnownPositivePercent: number;
  knownObservationCount: number;
  unknownObservationIds: string[];
} => {
  unique(ids, "observations");
  aligned(ids, flags, "flags");
  aligned(ids, known, "known");
  binary(flags, "flags");
  binary(known, "known");
  const n = positive(sum(known), "knownobservations");
  return {
    observedKnownPositivePercent:
      (100 * sum(flags.map((v, i) => v * known[i]))) / n,
    knownObservationCount: n,
    unknownObservationIds: ids.filter((_, i) => !known[i]),
  };
};
export const gaussianProbability = (
  values: readonly number[],
  affectedMean: readonly number[],
  unaffectedMean: readonly number[],
  affectedCovariance: readonly (readonly number[])[],
  unaffectedCovariance: readonly (readonly number[])[],
  prior: number,
  dimensions: number,
): {
  conditionalPosteriorModelProbability: number;
  conditionalLogLikelihoodRatio: number;
} => {
  if (values.length !== dimensions || dimensions < 1 || dimensions > 4)
    simpleError("dimensions", "Declared bounded instrument dimensions.");
  const logDensity = (
    mu: readonly number[],
    cov: readonly (readonly number[])[],
  ): number => {
    aligned(values, mu, "mean");
    if (
      cov.length !== dimensions ||
      cov.some((r) => r.length !== dimensions) ||
      cov.some((r, i) => r.some((v, j) => v !== cov[j][i]))
    )
      simpleError(
        "covariance",
        "Actual square symmetric independently validated covariance.",
      );
    const l = Array.from(
      { length: dimensions },
      () => Array(dimensions).fill(0) as number[],
    );
    for (let i = 0; i < dimensions; i++)
      for (let j = 0; j <= i; j++) {
        let a = cov[i][j];
        for (let k = 0; k < j; k++) a -= l[i][k] * l[j][k];
        if (i === j)
          l[i][j] = Math.sqrt(positive(a, "positive-definitecovariance"));
        else l[i][j] = a / l[j][j];
      }
    const z: number[] = [];
    for (let i = 0; i < dimensions; i++) {
      let a = values[i] - mu[i];
      for (let j = 0; j < i; j++) a -= l[i][j] * z[j];
      z[i] = a / l[i][i];
    }
    return finite(
      -0.5 * sum(z.map((v) => v * v)) - sum(l.map((r, i) => Math.log(r[i]))),
    );
  };
  if (prior <= 0 || prior >= 1)
    simpleError(
      "prior",
      "Caller independently calibrated prior strictly between 0 and 1.",
    );
  const lr =
      logDensity(affectedMean, affectedCovariance) -
      logDensity(unaffectedMean, unaffectedCovariance),
    odds = Math.log(prior) - Math.log1p(-prior) + lr,
    p =
      odds >= 0
        ? 1 / (1 + Math.exp(-odds))
        : Math.exp(odds) / (1 + Math.exp(odds));
  return {
    conditionalPosteriorModelProbability: p,
    conditionalLogLikelihoodRatio: finite(lr),
  };
};
