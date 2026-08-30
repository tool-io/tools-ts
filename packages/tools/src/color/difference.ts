import { lab } from "./spaces.js";
import { simpleError } from "../core/simple.js";
const rad = (x: number): number => (x * Math.PI) / 180;
const degrees = (y: number, x: number): number => {
  const h = (Math.atan2(y, x) * 180) / Math.PI;
  return h < 0 ? h + 360 : h;
};
export const delta94 = (
  a: readonly number[],
  b: readonly number[],
  textiles: boolean,
): number => {
  lab(a);
  lab(b);
  const c1 = Math.hypot(a[1], a[2]),
    c2 = Math.hypot(b[1], b[2]),
    dL = a[0] - b[0],
    dC = c1 - c2,
    dH2 = Math.max(0, (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 - dC * dC),
    kL = textiles ? 2 : 1,
    k1 = textiles ? 0.048 : 0.045,
    k2 = textiles ? 0.014 : 0.015;
  return Math.sqrt(
    (dL / kL) ** 2 + (dC / (1 + k1 * c1)) ** 2 + dH2 / (1 + k2 * c1) ** 2,
  );
};
export const delta2000 = (
  first: readonly number[],
  second: readonly number[],
  kL = 1,
  kC = 1,
  kH = 1,
): number => {
  lab(first);
  lab(second);
  if ([kL, kC, kH].some((v) => !Number.isFinite(v) || v <= 0 || v > 100))
    return simpleError("weights", "Positive CIEDE2000 factors ≤100 required.");
  const [L1, a1, b1] = first,
    [L2, a2, b2] = second,
    C1 = Math.hypot(a1, b1),
    C2 = Math.hypot(a2, b2),
    avgC = (C1 + C2) / 2,
    G = 0.5 * (1 - Math.sqrt(avgC ** 7 / (avgC ** 7 + 25 ** 7))),
    ap1 = (1 + G) * a1,
    ap2 = (1 + G) * a2,
    cp1 = Math.hypot(ap1, b1),
    cp2 = Math.hypot(ap2, b2),
    h1 = cp1 === 0 ? 0 : degrees(b1, ap1),
    h2 = cp2 === 0 ? 0 : degrees(b2, ap2),
    dL = L2 - L1,
    dC = cp2 - cp1;
  let dh = 0;
  if (cp1 * cp2 !== 0) {
    dh = h2 - h1;
    if (dh > 180) dh -= 360;
    else if (dh < -180) dh += 360;
  }
  const dH = 2 * Math.sqrt(cp1 * cp2) * Math.sin(rad(dh / 2)),
    avgL = (L1 + L2) / 2,
    cp = (cp1 + cp2) / 2;
  let hbar = h1 + h2;
  if (cp1 * cp2 !== 0) {
    if (Math.abs(h1 - h2) <= 180) hbar /= 2;
    else hbar = (hbar + (hbar < 360 ? 360 : -360)) / 2;
  }
  const T =
      1 -
      0.17 * Math.cos(rad(hbar - 30)) +
      0.24 * Math.cos(rad(2 * hbar)) +
      0.32 * Math.cos(rad(3 * hbar + 6)) -
      0.2 * Math.cos(rad(4 * hbar - 63)),
    SL = 1 + (0.015 * (avgL - 50) ** 2) / Math.sqrt(20 + (avgL - 50) ** 2),
    SC = 1 + 0.045 * cp,
    SH = 1 + 0.015 * cp * T,
    RT =
      -2 *
      Math.sqrt(cp ** 7 / (cp ** 7 + 25 ** 7)) *
      Math.sin(rad(60 * Math.exp(-(((hbar - 275) / 25) ** 2)))),
    l = dL / (kL * SL),
    c = dC / (kC * SC),
    h = dH / (kH * SH);
  return Math.sqrt(Math.max(0, l * l + c * c + h * h + RT * c * h));
};
export const deltaCmc = (
  reference: readonly number[],
  sample: readonly number[],
  lightnessWeight: number,
  chromaWeight: number,
): number => {
  lab(reference);
  lab(sample);
  if (
    [lightnessWeight, chromaWeight].some(
      (v) => !Number.isFinite(v) || v <= 0 || v > 100,
    )
  )
    return simpleError(
      "weights",
      "Positive CMC lightness/chroma weights ≤100 required.",
    );
  const [L, a, b] = reference,
    C = Math.hypot(a, b),
    Cs = Math.hypot(sample[1], sample[2]),
    h = degrees(b, a),
    F = Math.sqrt(C ** 4 / (C ** 4 + 1900)),
    T =
      h >= 164 && h <= 345
        ? 0.56 + Math.abs(0.2 * Math.cos(rad(h + 168)))
        : 0.36 + Math.abs(0.4 * Math.cos(rad(h + 35))),
    SL = L < 16 ? 0.511 : (0.040975 * L) / (1 + 0.01765 * L),
    SC = (0.0638 * C) / (1 + 0.0131 * C) + 0.638,
    SH = SC * (F * T + 1 - F),
    dL = L - sample[0],
    dC = C - Cs,
    dH2 = Math.max(0, (a - sample[1]) ** 2 + (b - sample[2]) ** 2 - dC * dC);
  return Math.sqrt(
    (dL / (lightnessWeight * SL)) ** 2 +
      (dC / (chromaWeight * SC)) ** 2 +
      dH2 / (SH * SH),
  );
};
