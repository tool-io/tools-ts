import { simpleError } from "../core/simple.js";
import { positive, count, aligned, ordered } from "../neuroscience/shared.js";
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
  median,
  regression,
  integral,
  quantile,
  norm,
  normalQuantile,
} from "../neuroscience/shared.js";
export { maximum, minimum, interpolate } from "../mining/shared.js";
export { shape } from "../archaeology/shared.js";

export const months = (x: readonly number[], f: string): void => {
  if (x.length !== 12)
    simpleError(f, "Exactly twelve monthly values required.");
};
export const runs = (
  flags: readonly boolean[],
  minimum = 1,
): { starts: number[]; lengths: number[]; days: number } => {
  count(minimum, "minimumRun", 1);
  const starts: number[] = [],
    lengths: number[] = [];
  for (let i = 0; i < flags.length;) {
    if (!flags[i]) {
      i++;
      continue;
    }
    const start = i;
    while (i < flags.length && flags[i]) i++;
    if (i - start >= minimum) {
      starts.push(start);
      lengths.push(i - start);
    }
  }
  return { starts, lengths, days: lengths.reduce((a, b) => a + b, 0) };
};
export const boundedPairs = (n: number): void => {
  if (n < 2 || (n * (n - 1)) / 2 > 1000000)
    simpleError(
      "samples",
      "Two or more samples and at most one million pairs required.",
    );
};
export const solar = (
  latitudeDegrees: number,
  declinationRadians: number,
): { omega: number; phi: number } => {
  if (
    Math.abs(latitudeDegrees) > 90 ||
    Math.abs(declinationRadians) > Math.PI / 2
  )
    simpleError("angles", "Physical latitude and declination required.");
  const phi = (latitudeDegrees * Math.PI) / 180,
    a = Math.sin(phi) * Math.sin(declinationRadians),
    b = Math.cos(phi) * Math.cos(declinationRadians);
  const omega =
    b < 1e-15
      ? a > 0
        ? Math.PI
        : 0
      : Math.acos(Math.max(-1, Math.min(1, -a / b)));
  return { omega, phi };
};
export const sinePositive = (
  minimum: number,
  maximum: number,
  base: number,
): number => {
  if (maximum < minimum)
    simpleError("temperatures", "Daily maximum cannot be below minimum.");
  const m = (minimum + maximum) / 2 - base,
    a = (maximum - minimum) / 2;
  if (a === 0) return Math.max(0, m);
  if (m >= a) return m;
  if (m <= -a) return 0;
  const t = Math.asin(-m / a);
  return (m * (Math.PI / 2 - t) + a * Math.cos(t)) / Math.PI;
};
export const profile = (z: readonly number[], y: readonly number[]): void => {
  ordered(z, "heights");
  aligned(z, y, "profile");
};
export const sliceProfile = (
  z: readonly number[],
  y: readonly number[],
  lo: number,
  hi: number,
): { z: number[]; y: number[] } => {
  profile(z, y);
  if (lo < z[0] || hi > z.at(-1)! || hi <= lo)
    simpleError(
      "heightWindow",
      "Ordered window inside observed profile required.",
    );
  const at = (h: number): number => {
    for (let i = 1; i < z.length; i++)
      if (h <= z[i])
        return (
          y[i - 1] + ((y[i] - y[i - 1]) * (h - z[i - 1])) / (z[i] - z[i - 1])
        );
    return y.at(-1)!;
  };
  const indices = z.flatMap((h, i) => (h > lo && h < hi ? [i] : []));
  return {
    z: [lo, ...indices.map((i) => z[i]), hi],
    y: [at(lo), ...indices.map((i) => y[i]), at(hi)],
  };
};
export const signedArea = (
  z: readonly number[],
  y: readonly number[],
  positivePart: boolean,
): number => {
  profile(z, y);
  let area = 0;
  for (let i = 1; i < z.length; i++) {
    const a = y[i - 1],
      b = y[i],
      w = z[i] - z[i - 1],
      sign = positivePart ? 1 : -1;
    if (sign * a >= 0 && sign * b >= 0) area += (w * (a + b)) / 2;
    else if (sign * a > 0)
      area += ((w * a * a) / (2 * (Math.abs(a) + Math.abs(b)))) * sign;
    else if (sign * b > 0)
      area += ((w * b * b) / (2 * (Math.abs(a) + Math.abs(b)))) * sign;
  }
  return area;
};
export const contingency = (
  hits: number,
  misses: number,
  falseAlarms: number,
  correctNegatives: number,
): number => {
  [hits, misses, falseAlarms, correctNegatives].forEach((v) =>
    count(v, "counts"),
  );
  const total = hits + misses + falseAlarms + correctNegatives;
  count(total, "totalCases", 1);
  return total;
};
export const buoyancy = (
  parcelK: readonly number[],
  environmentK: readonly number[],
  gravity: number,
): number[] => {
  aligned(parcelK, environmentK, "temperatures");
  positive(gravity, "gravity");
  return parcelK.map(
    (t, i) =>
      (gravity *
        (positive(t, "parcelTemperature") -
          positive(environmentK[i], "environmentTemperature"))) /
      environmentK[i],
  );
};
