/**
 * Small deterministic statistics helpers shared by probe-analysis tools.
 * All functions expect finite numbers and never mutate their inputs.
 */

export const medianFromSorted = (sorted: readonly number[]): number => {
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};

/** Nearest-rank percentile over an ascending-sorted array. */
export const percentileFromSorted = (
  sorted: readonly number[],
  percentile: number,
): number => {
  const rank = Math.max(1, Math.ceil((percentile / 100) * sorted.length));
  return sorted[Math.min(rank, sorted.length) - 1];
};

export const meanAbsoluteConsecutiveDelta = (
  values: readonly number[],
): number | null => {
  if (values.length < 2) return null;
  let sum = 0;
  for (let index = 1; index < values.length; index += 1)
    sum += Math.abs(values[index] - values[index - 1]);
  return sum / (values.length - 1);
};

/** Returns the first candidate within tolerance ratio of value, else null. */
export const matchCandidate = (
  value: number,
  candidates: readonly number[],
  toleranceRatio: number,
): number | null => {
  for (const candidate of candidates)
    if (Math.abs(value - candidate) <= candidate * toleranceRatio)
      return candidate;
  return null;
};

const ERF_SERIES_BOUNDARY = 2;
const MAX_ITERATION_STEPS = 1_000;
const MAX_SERIES_TERMS = 64;
const MAX_CONTINUED_FRACTION_STEPS = 300;

/** Maclaurin series for erf, accurate for magnitudes up to ERF_SERIES_BOUNDARY. */
const erfSeries = (x: number): number => {
  const square = x * x;
  let term = x;
  let sum = x;
  for (let n = 1; n < MAX_SERIES_TERMS; n += 1) {
    term *= -square / n;
    sum += term / (2 * n + 1);
    if (Math.abs(term) <= Number.EPSILON * Math.abs(sum)) break;
  }
  return (2 / Math.sqrt(Math.PI)) * sum;
};

/**
 * Laplace continued fraction for the complementary error function,
 * evaluated with the modified Lentz algorithm. Accurate for x > 2:
 *
 *   erfc(x) = exp(-x^2) / (sqrt(pi) * (x + (1/2)/(x + 1/(x + (3/2)/(x + ...)))))
 */
const erfcContinuedFraction = (x: number): number => {
  const tiny = Number.EPSILON ** 2;
  let value = x;
  let forward = value;
  let backward = 0;
  for (let n = 1; n <= MAX_CONTINUED_FRACTION_STEPS; n += 1) {
    backward = x + (n / 2) * backward;
    if (Math.abs(backward) < tiny) backward = tiny;
    backward = 1 / backward;
    forward = x + n / 2 / forward;
    if (Math.abs(forward) < tiny) forward = tiny;
    const delta = forward * backward;
    value *= delta;
    if (Math.abs(delta - 1) <= Number.EPSILON) break;
  }
  return Math.exp(-x * x) / Math.sqrt(Math.PI) / value;
};

/** Error function erf(x). Returns NaN for non-finite input. */
export const erf = (value: number): number => {
  if (!Number.isFinite(value)) return Number.NaN;
  if (value === 0) return 0;
  const magnitude = Math.abs(value);
  const result =
    magnitude <= ERF_SERIES_BOUNDARY
      ? erfSeries(magnitude)
      : 1 - erfcContinuedFraction(magnitude);
  return value > 0 ? result : -result;
};

/** Complementary error function erfc(x). Returns NaN for non-finite input. */
export const erfc = (value: number): number => {
  if (!Number.isFinite(value)) return Number.NaN;
  if (value < 0) return 2 - erfc(-value);
  return value <= ERF_SERIES_BOUNDARY
    ? 1 - erfSeries(value)
    : erfcContinuedFraction(value);
};

/** Standard normal cumulative distribution function Phi(z). */
export const normalCdf = (value: number): number =>
  Number.isFinite(value) ? 0.5 * erfc(-value / Math.SQRT2) : Number.NaN;

const PROBIT_LOW_COEFFICIENTS = [
  -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
  1.38357751867269e2, -3.066479806614716e1, 2.506628277459239,
];
const PROBIT_LOW_DENOMINATORS = [
  -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
  6.680131188771972e1, -1.328068155288572e1,
];
const PROBIT_TAIL_COEFFICIENTS = [
  -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
  -2.549732539343734, 4.374664141464968, 2.938163982698783,
];
const PROBIT_TAIL_DENOMINATORS = [
  7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
  3.754408661907416,
];
const PROBIT_REGION_BOUNDARY = 0.02425;

/**
 * Inverse standard normal cumulative distribution function (probit),
 * from Peter Acklam's rational approximation refined with Halley steps.
 * Returns NaN for probabilities outside the open interval (0, 1).
 */
export const inverseNormalCdf = (probability: number): number => {
  if (!Number.isFinite(probability) || probability <= 0 || probability >= 1)
    return Number.NaN;
  if (probability === 0.5) return 0;
  let estimate: number;
  if (probability < PROBIT_REGION_BOUNDARY) {
    const q = Math.sqrt(-2 * Math.log(probability));
    estimate =
      (((((PROBIT_TAIL_COEFFICIENTS[0]! * q +
        PROBIT_TAIL_COEFFICIENTS[1]!) *
        q +
        PROBIT_TAIL_COEFFICIENTS[2]!) *
        q +
        PROBIT_TAIL_COEFFICIENTS[3]!) *
        q +
        PROBIT_TAIL_COEFFICIENTS[4]!) *
        q +
        PROBIT_TAIL_COEFFICIENTS[5]!) /
      ((((PROBIT_TAIL_DENOMINATORS[0]! * q +
        PROBIT_TAIL_DENOMINATORS[1]!) *
        q +
        PROBIT_TAIL_DENOMINATORS[2]!) *
        q +
        PROBIT_TAIL_DENOMINATORS[3]!) *
        q +
        1);
  } else if (probability <= 1 - PROBIT_REGION_BOUNDARY) {
    const q = probability - 0.5;
    const r = q * q;
    estimate =
      (((((PROBIT_LOW_COEFFICIENTS[0]! * r +
        PROBIT_LOW_COEFFICIENTS[1]!) *
        r +
        PROBIT_LOW_COEFFICIENTS[2]!) *
        r +
        PROBIT_LOW_COEFFICIENTS[3]!) *
        r +
        PROBIT_LOW_COEFFICIENTS[4]!) *
        r +
        PROBIT_LOW_COEFFICIENTS[5]!) *
      q /
      (((((PROBIT_LOW_DENOMINATORS[0]! * r +
        PROBIT_LOW_DENOMINATORS[1]!) *
        r +
        PROBIT_LOW_DENOMINATORS[2]!) *
        r +
        PROBIT_LOW_DENOMINATORS[3]!) *
        r +
        PROBIT_LOW_DENOMINATORS[4]!) *
        r +
        1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - probability));
    estimate =
      -(((((PROBIT_TAIL_COEFFICIENTS[0]! * q +
        PROBIT_TAIL_COEFFICIENTS[1]!) *
        q +
        PROBIT_TAIL_COEFFICIENTS[2]!) *
        q +
        PROBIT_TAIL_COEFFICIENTS[3]!) *
        q +
        PROBIT_TAIL_COEFFICIENTS[4]!) *
        q +
        PROBIT_TAIL_COEFFICIENTS[5]!) /
      ((((PROBIT_TAIL_DENOMINATORS[0]! * q +
        PROBIT_TAIL_DENOMINATORS[1]!) *
        q +
        PROBIT_TAIL_DENOMINATORS[2]!) *
        q +
        PROBIT_TAIL_DENOMINATORS[3]!) *
        q +
        1);
  }
  for (let step = 0; step < 2; step += 1) {
    const error = 0.5 * erfc(-estimate / Math.SQRT2) - probability;
    const adjustment =
      error * Math.exp((estimate * estimate) / 2) * Math.sqrt(2 * Math.PI);
    estimate -= adjustment / (1 + (estimate * adjustment) / 2);
  }
  return estimate;
};

/** Lanczos approximation coefficients (g = 7, n = 9). */
const LOG_GAMMA_COEFFICIENTS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
];

/** Natural logarithm of the absolute gamma function. Returns NaN on poles. */
export const logGamma = (value: number): number => {
  if (!Number.isFinite(value)) return Number.NaN;
  if (value <= 0 && Number.isInteger(value)) return Number.NaN;
  if (value < 0.5)
    return (
      Math.log(Math.PI / Math.abs(Math.sin(Math.PI * value))) -
      logGamma(1 - value)
    );
  const shifted = value - 1;
  let series = LOG_GAMMA_COEFFICIENTS[0]!;
  const base = shifted + 7.5;
  for (let index = 1; index < LOG_GAMMA_COEFFICIENTS.length; index += 1)
    series += LOG_GAMMA_COEFFICIENTS[index]! / (shifted + index);
  return (
    0.5 * Math.log(2 * Math.PI) +
    (shifted + 0.5) * Math.log(base) -
    base +
    Math.log(series)
  );
};

/** Series expansion of the regularized lower incomplete gamma function. */
const lowerGammaSeries = (shape: number, value: number): number => {
  let term = 1 / shape;
  let sum = term;
  let shifted = shape;
  for (let iteration = 0; iteration < MAX_ITERATION_STEPS; iteration += 1) {
    shifted += 1;
    term *= value / shifted;
    sum += term;
    if (Math.abs(term) <= Math.abs(sum) * Number.EPSILON) break;
  }
  return (
    sum * Math.exp(-value + shape * Math.log(value) - logGamma(shape))
  );
};

/**
 * Continued fraction for the regularized upper incomplete gamma function,
 * evaluated with the modified Lentz algorithm.
 */
const upperGammaContinuedFraction = (
  shape: number,
  value: number,
): number => {
  const tiny = Number.EPSILON ** 2;
  let denominator = value + 1 - shape;
  let forward = 1 / tiny;
  let backward = Math.abs(denominator) < tiny ? 1 / tiny : 1 / denominator;
  let result = backward;
  for (let step = 1; step <= MAX_ITERATION_STEPS; step += 1) {
    const numerator = -step * (step - shape);
    denominator += 2;
    backward = numerator * backward + denominator;
    if (Math.abs(backward) < tiny) backward = tiny;
    forward = denominator + numerator / forward;
    if (Math.abs(forward) < tiny) forward = tiny;
    backward = 1 / backward;
    const delta = backward * forward;
    result *= delta;
    if (Math.abs(delta - 1) <= Number.EPSILON) break;
  }
  return (
    Math.exp(-value + shape * Math.log(value) - logGamma(shape)) * result
  );
};

/**
 * Regularized lower incomplete gamma function P(shape, value).
 * Returns NaN for shape <= 0, non-finite arguments, or negative values.
 */
export const lowerRegularizedGamma = (
  shape: number,
  value: number,
): number => {
  if (
    !Number.isFinite(shape) ||
    shape <= 0 ||
    !Number.isFinite(value) ||
    value < 0
  )
    return Number.NaN;
  if (value === 0) return 0;
  return value < shape + 1
    ? lowerGammaSeries(shape, value)
    : 1 - upperGammaContinuedFraction(shape, value);
};
