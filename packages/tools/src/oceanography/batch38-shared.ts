import { simpleError } from "../core/simple.js";
import { finite } from "../plumbing/batch35-shared.js";
export * from "../engineering/batch38-shared.js";
export { seawaterDensity } from "./shared.js";
export const pss78 = (
  conductivityRatio: number,
  t: number,
  p: number,
): number => {
  if (
    ![conductivityRatio, t, p].every(Number.isFinite) ||
    conductivityRatio <= 0 ||
    t < -2 ||
    t > 35 ||
    p < 0 ||
    p > 10000
  )
    simpleError(
      "CTD",
      "PSS-78 ratio > 0, IPTS-68 temperature −2–35 °C, and gauge pressure 0–10,000 dbar.",
    );
  const rt =
      0.6766097 +
      0.0200564 * t +
      0.0001104259 * t * t -
      0.00000069698 * t ** 3 +
      0.0000000010031 * t ** 4,
    rp =
      1 +
      (p * (0.0000207 - 0.000000000637 * p + 0.000000000000003989 * p * p)) /
        (1 +
          0.03426 * t +
          0.0004464 * t * t +
          (0.4215 - 0.003107 * t) * conductivityRatio),
    r = conductivityRatio / (rp * rt);
  if (!(r > 0)) simpleError("ratio", "Positive corrected ratio required.");
  const a = [0.008, -0.1692, 25.3851, 14.0941, -7.0261, 2.7081],
    b = [0.0005, -0.0056, -0.0066, -0.0375, 0.0636, -0.0144],
    x = Math.sqrt(r),
    delta = (t - 15) / (1 + 0.0162 * (t - 15));
  const s =
    a.reduceRight((v, c) => v * x + c, 0) +
    delta * b.reduceRight((v, c) => v * x + c, 0);
  if (!Number.isFinite(s) || s < 2 || s > 42)
    simpleError(
      "salinity",
      "PSS-78 practical salinity must be 2–42; no low-salinity extension is applied.",
    );
  return s;
};
export const potentialTemperature = (
  s: number,
  t: number,
  p: number,
  ref: number,
): number => {
  if (
    ![s, t, p, ref].every(Number.isFinite) ||
    s < 0 ||
    s > 42 ||
    t < -2 ||
    t > 40 ||
    p < 0 ||
    p > 10000 ||
    ref < 0 ||
    ref > 10000
  )
    simpleError(
      "UNESCO",
      "Salinity 0–42, IPTS-68 temperature −2–40 °C, and gauge pressure 0–10,000 dbar.",
    );
  const gradient = (temp: number, pressure: number) => {
    const ds = s - 35;
    return (
      (((-2.1687e-16 * temp + 1.8676e-14) * temp - 4.6206e-13) * pressure +
        (2.7759e-12 * temp - 1.1351e-10) * ds +
        ((-5.4481e-14 * temp + 8.733e-12) * temp - 6.7795e-10) * temp +
        1.8741e-8) *
        pressure +
      (-4.2393e-8 * temp + 1.8932e-6) * ds +
      ((6.6228e-10 * temp - 6.836e-8) * temp + 8.5258e-6) * temp +
      3.5803e-5
    );
  };
  const steps = Math.max(1, Math.ceil(Math.abs(ref - p) / 10)),
    h = (ref - p) / steps;
  let temp = t;
  for (let i = 0; i < steps; i++) {
    const pressure = p + i * h,
      k1 = gradient(temp, pressure),
      k2 = gradient(temp + (h * k1) / 2, pressure + h / 2),
      k3 = gradient(temp + (h * k2) / 2, pressure + h / 2),
      k4 = gradient(temp + h * k3, pressure + h);
    temp = finite(temp + (h * (k1 + 2 * k2 + 2 * k3 + k4)) / 6);
    if (temp < -2 || temp > 40)
      simpleError(
        "state",
        "Adiabatic path left supported temperature range−2..40C.",
      );
  }
  return temp;
};
