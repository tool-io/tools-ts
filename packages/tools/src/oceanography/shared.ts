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
export { maximum, minimum, interpolate } from "../mining/shared.js";
export { crossing } from "../glaciology/shared.js";
import {
  positive,
  nonnegative,
  aligned,
  ordered,
} from "../neuroscience/shared.js";
// UNESCO EOS-80: IPTS-68 Celsius, practical salinity, gauge pressure dbar.
export const seawaterDensity = (t: number, s: number, p: number): number => {
  if (
    t < 0 ||
    t > 40 ||
    s < 0 ||
    s > 42 ||
    p < 0 ||
    p > 10000 ||
    ![t, s, p].every(Number.isFinite)
  )
    simpleError(
      "state",
      "EOS-80 implementation supports 0–40 °C IPTS-68, salinity 0–42 and 0–10000 gauge dbar.",
    );
  const rw =
    999.842594 +
    6.793952e-2 * t -
    9.09529e-3 * t ** 2 +
    1.001685e-4 * t ** 3 -
    1.120083e-6 * t ** 4 +
    6.536332e-9 * t ** 5;
  const rho =
    rw +
    (0.824493 -
      4.0899e-3 * t +
      7.6438e-5 * t ** 2 -
      8.2467e-7 * t ** 3 +
      5.3875e-9 * t ** 4) *
      s +
    (-5.72466e-3 + 1.0227e-4 * t - 1.6546e-6 * t ** 2) * s ** 1.5 +
    4.8314e-4 * s ** 2;
  const kw =
    19652.21 +
    148.4206 * t -
    2.327105 * t ** 2 +
    1.360477e-2 * t ** 3 -
    5.155288e-5 * t ** 4;
  const k0 =
    kw +
    (54.6746 - 0.603459 * t + 1.09987e-2 * t ** 2 - 6.167e-5 * t ** 3) * s +
    (7.944e-2 + 1.6483e-2 * t - 5.3009e-4 * t ** 2) * s ** 1.5;
  const b = p / 10,
    k =
      k0 +
      b *
        (3.239908 +
          1.43713e-3 * t +
          1.16092e-4 * t ** 2 -
          5.77905e-7 * t ** 3 +
          (2.2838e-3 - 1.0981e-5 * t - 1.6078e-6 * t ** 2) * s +
          1.91075e-4 * s ** 1.5) +
      b *
        b *
        (8.50935e-5 -
          6.12293e-6 * t +
          5.2787e-8 * t ** 2 +
          (-9.9348e-7 + 2.0816e-8 * t + 9.1697e-10 * t ** 2) * s);
  return rho / positive(1 - b / k, "pressureDbar");
};
export const wave = (
  period: number,
  depth: number,
  g: number,
): { k: number; omega: number; phase: number; group: number } => {
  positive(period, "periodSeconds");
  positive(depth, "depthM");
  positive(g, "gravity");
  const omega = (2 * Math.PI) / period,
    q = positive((omega * omega * depth) / g, "dispersionScale");
  let lo = q < 1 ? Math.sqrt(q) : q,
    hi = q < 1 ? 2 * Math.sqrt(q) : q + 1;
  if (!Number.isFinite(hi))
    simpleError("dispersionScale", "Unrepresentable dispersion scale.");
  for (let i = 0; i < 100; i++) {
    const mid = lo + (hi - lo) / 2;
    if (mid * Math.tanh(mid) < q) lo = mid;
    else hi = mid;
  }
  const x = positive(lo + (hi - lo) / 2, "waveNumber"),
    k = positive(x / depth, "waveNumber"),
    n = 0.5 * (1 + (x > 350 ? 0 : (2 * x) / Math.sinh(2 * x))),
    phase = omega / k;
  return { k, omega, phase, group: phase * n };
};
export const simpson = (
  f: (x: number) => number,
  a: number,
  b: number,
  n: number,
): number => {
  if (
    !Number.isSafeInteger(n) ||
    n < 2 ||
    n > 16384 ||
    n % 2 ||
    !Number.isFinite(a) ||
    !Number.isFinite(b) ||
    b < a
  )
    simpleError(
      "panels",
      "Ordered finite bounds and 2–16384 even Simpson panels required.",
    );
  const h = (b - a) / n;
  let sum = f(a) + f(b);
  for (let i = 1; i < n; i++) sum += (i % 2 ? 4 : 2) * f(a + i * h);
  return (h * sum) / 3;
};
export const layers = (
  bounds: readonly number[],
  values: readonly number[],
): void => {
  ordered(bounds, "layerBoundaries");
  aligned(bounds.slice(1), values, "layers");
  bounds.forEach((v) => nonnegative(v, "layerBoundaries"));
};
