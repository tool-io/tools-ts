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
  norm,
} from "../neuroscience/shared.js";
import {
  positive,
  nonnegative,
  count,
  ordered,
  aligned,
} from "../neuroscience/shared.js";

export const flipRadians = (angle: number): number => {
  if (!Number.isFinite(angle) || angle <= 0 || angle > 180)
    simpleError("flipDegrees", "Flip angle must be in (0,180] degrees.");
  return (angle * Math.PI) / 180;
};
export const bValue = (
  gammaHzPerTesla: number,
  gradientMilliTeslaPerMeter: number,
  deltaMs: number,
  separationMs: number,
): number => {
  positive(gammaHzPerTesla, "gammaHzPerTesla");
  nonnegative(gradientMilliTeslaPerMeter, "gradientMilliTeslaPerMeter");
  positive(deltaMs, "deltaMs");
  if (separationMs < deltaMs)
    simpleError(
      "separationMs",
      "Rectangular pulse leading-edge separation must be at least pulse duration.",
    );
  const gamma = 2 * Math.PI * gammaHzPerTesla,
    G = gradientMilliTeslaPerMeter / 1000,
    d = deltaMs / 1000,
    D = separationMs / 1000;
  return ((gamma * G * d) ** 2 * (D - d / 3)) / 1e6;
};
export const uniformTimes = (t: readonly number[]): number => {
  ordered(t, "timesSeconds");
  const dt = t[1] - t[0];
  if (
    t.some(
      (v, i) =>
        i > 0 && Math.abs(v - t[i - 1] - dt) > Math.max(1, Math.abs(dt)) * 1e-9,
    )
  )
    simpleError("timesSeconds", "Uniform time sampling required.");
  return dt;
};
export const trajectory = (
  timesMs: readonly number[],
  gradients: readonly (readonly number[])[],
  gammaHzPerTesla: number,
): number[][] => {
  ordered(timesMs, "timesMs");
  aligned(timesMs, gradients, "timesMs");
  positive(gammaHzPerTesla, "gammaHzPerTesla");
  if (gradients.some((row) => row.length !== 2) || timesMs.length > 128)
    simpleError(
      "gradients",
      "Two gradient components and at most 128 timestamps required.",
    );
  const result: number[][] = [[0, 0]];
  for (let i = 1; i < timesMs.length; i++) {
    const dt = (timesMs[i] - timesMs[i - 1]) / 1000;
    result.push(
      result[i - 1].map(
        (v, j) =>
          v +
          (gammaHzPerTesla * dt * (gradients[i - 1][j] + gradients[i][j])) /
            2000,
      ),
    );
  }
  return result;
};
export const hrf = (
  times: readonly number[],
  peakShape: number,
  undershootShape: number,
  scaleSeconds: number,
  undershootRatio: number,
): number[] => {
  count(peakShape, "peakShape", 1);
  count(undershootShape, "undershootShape", 1);
  positive(scaleSeconds, "scaleSeconds");
  positive(undershootRatio, "undershootRatio");
  if (peakShape > 32 || undershootShape > 32 || undershootShape <= peakShape)
    simpleError(
      "undershootShape",
      "Integer gamma shapes within 1–32 and undershoot shape above peak shape required.",
    );
  const density = (t: number, k: number): number => {
    nonnegative(t, "timesSeconds");
    if (t === 0) return k === 1 ? 1 / scaleSeconds : 0;
    let logFactorial = 0;
    for (let i = 2; i < k; i++) logFactorial += Math.log(i);
    return (
      Math.exp(
        (k - 1) * Math.log(t / scaleSeconds) - t / scaleSeconds - logFactorial,
      ) / scaleSeconds
    );
  };
  return times.map(
    (t) =>
      density(t, peakShape) - density(t, undershootShape) / undershootRatio,
  );
};
export const wrapIndex = (index: number, n: number): number => {
  count(index, "sampleIndex");
  count(n, "matrixSize", 1);
  return ((index % n) + n) % n;
};
