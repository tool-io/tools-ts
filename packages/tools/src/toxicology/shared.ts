import { simpleError } from "../core/simple.js";
export {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
  aligned,
  ordered,
  mean,
  variance,
  regression,
  integral,
  quantile,
  normalQuantile,
  norm,
} from "../neuroscience/shared.js";
import {
  positive,
  fraction,
  normalQuantile,
  ordered,
  aligned,
} from "../neuroscience/shared.js";

export const normalCdf = (z: number): number => {
  if (!Number.isFinite(z))
    simpleError("model", "Finite normal variates required.");
  if (z >= 8) return 1;
  if (z <= -8) return 0;
  const x = Math.abs(z);
  let term = x,
    sum = x;
  for (let i = 1; i < 256; i++) {
    term *= (x * x) / (2 * i + 1);
    sum += term;
    if (term <= 1e-16 * Math.max(1, sum)) break;
  }
  const area = (Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI)) * sum;
  return z < 0 ? 0.5 - area : 0.5 + area;
};
export const normalDensity = (z: number): number =>
  Math.exp((-z * z) / 2) / Math.sqrt(2 * Math.PI);
export const probitBenchmark = (
  intercept: number,
  slope: number,
  extraRisk: number,
): { dose: number; targetProbability: number; gradient: readonly number[] } => {
  positive(slope, "slope");
  fraction(extraRisk, "extraRisk");
  if (extraRisk === 0 || extraRisk === 1)
    simpleError("extraRisk", "Interior benchmark extra risk required.");
  const background = normalCdf(intercept),
    targetProbability = background + extraRisk * (1 - background),
    z = normalQuantile(targetProbability),
    dose = positive((z - intercept) / slope, "intercept");
  return {
    dose,
    targetProbability,
    gradient: [
      (((1 - extraRisk) * normalDensity(intercept)) /
        positive(normalDensity(z), "model") -
        1) /
        slope,
      -dose / slope,
    ],
  };
};
export const covariance2 = (m: readonly (readonly number[])[]): void => {
  if (
    m.length !== 2 ||
    m.some((row) => row.length !== 2) ||
    m[0][1] !== m[1][0] ||
    m[0][0] <= 0 ||
    m[1][1] <= 0 ||
    m[0][0] * m[1][1] - m[0][1] ** 2 <= 0
  )
    simpleError(
      "covariance",
      "A symmetric positive-definite two-parameter covariance required.",
    );
};
export const interpolateEffect = (
  doses: readonly number[],
  responses: readonly number[],
  target: number,
): number => {
  ordered(doses, "doses");
  aligned(doses, responses, "doses");
  doses.forEach((v) => positive(v, "doses"));
  if (responses.some((v, i) => i > 0 && v < responses[i - 1]))
    simpleError("responses", "Monotone increasing responses required.");
  const i = responses.findIndex((v) => v >= target);
  if (i < 0 || (i === 0 && responses[0] !== target))
    simpleError(
      "target",
      "Target is not bracketed; no extrapolation performed.",
    );
  if (responses[i] === target) return doses[i];
  return (
    doses[i - 1] +
    ((doses[i] - doses[i - 1]) * (target - responses[i - 1])) /
      (responses[i] - responses[i - 1])
  );
};
