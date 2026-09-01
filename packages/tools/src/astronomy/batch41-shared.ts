import { simpleError } from "../core/simple.js";
import {
  positive,
  nonnegative,
  fraction,
  bounded,
  aligned,
  unique,
  sum,
  mean,
  finite,
  shape,
} from "../cooking/batch40-shared.js";
export * from "../cooking/batch40-shared.js";
export const rad = (degrees: number): number => (degrees * Math.PI) / 180;
export const deg = (radians: number): number => (radians * 180) / Math.PI;
export const wrap = (v: number, period: number): number => {
  positive(period, "period");
  return ((v % period) + period) % period;
};
export const vector3 = (v: readonly number[], field: string): void => {
  if (v.length !== 3)
    simpleError(field, "Exactly three independently measured components.");
};
export const rgb3 = (v: readonly number[], field: string): void => {
  vector3(v, field);
  v.forEach((x) => fraction(x, field));
};
export const nearestSwatches = (
  ids: readonly string[],
  swatches: readonly (readonly number[])[],
  query: readonly number[],
): { nearestCallerIds: string[]; minimumDeclaredSpaceDistance: number } => {
  unique(ids, "palette");
  aligned(ids, swatches, "swatches");
  vector3(query, "query");
  if (shape(swatches, "coordinates") !== 3)
    simpleError(
      "space",
      "Three independently established same-space coordinates.",
    );
  const d = swatches.map((v) =>
      finite(Math.hypot(...v.map((x, i) => x - query[i]))),
    ),
    m = Math.min(...d);
  return {
    nearestCallerIds: ids.filter((_, i) => d[i] === m),
    minimumDeclaredSpaceDistance: m,
  };
};
export const standardDeviation = (v: readonly number[]): number => {
  const m = mean(v);
  return finite(Math.sqrt(mean(v.map((x) => (x - m) ** 2))));
};
export const normals = (
  temperature: readonly number[],
  precipitation: readonly number[],
): void => {
  if (temperature.length !== 12 || precipitation.length !== 12)
    simpleError(
      "normals",
      "Exactly twelve January–December homogeneous monthly normals.",
    );
  precipitation.forEach((v) => nonnegative(v, "precipitation"));
};
export const classifyKoppen = (
  t: readonly number[],
  p: readonly number[],
  north: boolean,
): {
  koppenCode: string;
  annualTemperatureC: number;
  annualPrecipitationMm: number;
  dryClimateThresholdMm: number;
} => {
  normals(t, p);
  const summer = north ? [3, 4, 5, 6, 7, 8] : [9, 10, 11, 0, 1, 2],
    winter = Array.from({ length: 12 }, (_, i) => i).filter(
      (i) => !summer.includes(i),
    ),
    s = summer.map((i) => p[i]),
    w = winter.map((i) => p[i]),
    total = sum(p),
    avg = mean(t),
    cold = Math.min(...t),
    hot = Math.max(...t),
    dry = Math.min(...p),
    share = total ? sum(s) / total : 0.5,
    threshold = 20 * avg + (share >= 0.7 ? 280 : share <= 0.3 ? 0 : 140);
  let code: string;
  if (total < threshold)
    code = (total < threshold / 2 ? "BW" : "BS") + (avg >= 18 ? "h" : "k");
  else if (hot < 10) code = hot >= 0 ? "ET" : "EF";
  else if (cold >= 18)
    code =
      dry >= 60
        ? "Af"
        : dry >= 100 - total / 25
          ? "Am"
          : p.indexOf(dry) >= 0 && summer.includes(p.indexOf(dry))
            ? "As"
            : "Aw";
  else {
    const main = cold > 0 ? "C" : "D",
      season =
        Math.min(...s) < 40 && Math.min(...s) < Math.max(...w) / 3
          ? "s"
          : Math.min(...w) < Math.max(...s) / 10
            ? "w"
            : "f",
      months = t.filter((v) => v >= 10).length,
      third =
        hot >= 22
          ? "a"
          : months >= 4
            ? "b"
            : main === "D" && cold < -38
              ? "d"
              : "c";
    code = main + season + third;
  }
  return {
    koppenCode: code,
    annualTemperatureC: avg,
    annualPrecipitationMm: total,
    dryClimateThresholdMm: threshold,
  };
};
export const classifyTrewartha = (
  t: readonly number[],
  p: readonly number[],
  north: boolean,
): {
  trewarthaThermalGroup: string;
  monthsAtLeastTenC: number;
  callerModelDryThresholdMm: number;
} => {
  normals(t, p);
  const summer = north ? [3, 4, 5, 6, 7, 8] : [9, 10, 11, 0, 1, 2],
    total = sum(p),
    share = total ? (100 * sum(summer.map((i) => p[i]))) / total : 50,
    n = t.filter((v) => v >= 10).length,
    threshold = 10 * (2.3 * mean(t) - 0.64 * share + 41);
  return {
    trewarthaThermalGroup:
      total < threshold
        ? "B"
        : Math.min(...t) >= 18
          ? "A"
          : n >= 8
            ? "C"
            : n >= 4
              ? "D"
              : n >= 1
                ? "E"
                : "F",
    monthsAtLeastTenC: n,
    callerModelDryThresholdMm: threshold,
  };
};
export const skyIntegral = (
  z: number,
  hubble: number,
  omegaMatter: number,
  kind: string,
): number => {
  if (z < 0 || z > 20)
    simpleError(
      "redshift",
      "0≤z≤20for bounded flat matter+Lambda model, radiation omitted.",
    );
  positive(hubble, "H0km/s/Mpc");
  fraction(omegaMatter, "matter density");
  if (kind !== "lookback" && kind !== "distance")
    simpleError("integral", "Known cosmological integral.");
  const steps = 2048,
    dz = z / steps,
    f = (x: number) =>
      1 /
      (Math.sqrt(omegaMatter * (1 + x) ** 3 + 1 - omegaMatter) *
        (kind === "lookback" ? 1 + x : 1));
  let result = f(0) + f(z);
  for (let i = 1; i < steps; i++) result += (i % 2 ? 4 : 2) * f(i * dz);
  return finite((result * dz) / 3);
};
export const normalQuantile = (p: number): number => {
  if (p <= 0 || p >= 1)
    simpleError(
      "cdf",
      "Finite standardized score requires0<CDF<1; censored tails are not fabricated.",
    );
  const a = [
      -39.69683028665376, 220.9460984245205, -275.9285104469687,
      138.357751867269, -30.66479806614716, 2.506628277459239,
    ],
    b = [
      -54.47609879822406, 161.5858368580409, -155.6989798598866,
      66.80131188771972, -13.28068155288572,
    ],
    c = [
      -0.007784894002430293, -0.3223964580411365, -2.400758277161838,
      -2.549732539343734, 4.374664141464968, 2.938163982698783,
    ],
    d = [
      0.007784695709041462, 0.3224671290700398, 2.445134137142996,
      3.754408661907416,
    ];
  const poly = (v: readonly number[], x: number) =>
    v.reduce((n, k) => n * x + k, 0);
  if (p < 0.02425) {
    const q = Math.sqrt(-2 * Math.log(p));
    return poly(c, q) / poly([...d, 1], q);
  }
  if (p > 0.97575) {
    const q = Math.sqrt(-2 * Math.log1p(-p));
    return -poly(c, q) / poly([...d, 1], q);
  }
  const q = p - 0.5,
    r = q * q;
  return (poly(a, r) * q) / poly([...b, 1], r);
};
export const stageAudit = (
  observed: readonly string[],
  declared: readonly string[],
): { missingDeclaredStageIds: string[]; orderInversionIndices: number[] } => {
  unique(declared, "declared stages");
  if (observed.length) unique(observed, "observed stages");
  if (observed.some((v) => !declared.includes(v)))
    simpleError("stages", "Known declared stage IDs only.");
  const p = observed.map((v) => declared.indexOf(v));
  return {
    missingDeclaredStageIds: declared.filter((v) => !observed.includes(v)),
    orderInversionIndices: p.flatMap((v, i) =>
      i > 0 && v < p[i - 1] ? [i] : [],
    ),
  };
};
export const pointAngle = (
  a: readonly number[],
  b: readonly number[],
): number => {
  if (a.length !== 2 || b.length !== 2)
    simpleError("rays", "Two measured planar ray vectors.");
  const la = positive(Math.hypot(...a), "ray"),
    lb = positive(Math.hypot(...b), "ray");
  return deg(
    Math.acos(
      Math.max(
        -1,
        Math.min(1, (a[0] / la) * (b[0] / lb) + (a[1] / la) * (b[1] / lb)),
      ),
    ),
  );
};
export const polygonArea = (xy: readonly (readonly number[])[]): number => {
  if (xy.length < 3 || shape(xy, "outline") !== 2)
    simpleError(
      "outline",
      "At least 3 caller-ordered simple planar outline vertices.",
    );
  return (
    Math.abs(
      sum(
        xy.map((v, i) =>
          finite(
            v[0] * xy[(i + 1) % xy.length][1] -
              v[1] * xy[(i + 1) % xy.length][0],
          ),
        ),
      ),
    ) / 2
  );
};
export const utcStamp = (s: string): number => {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(s))
    simpleError("time", "Strict real UTC second timestamp required.");
  const t = Date.parse(s);
  if (!Number.isFinite(t) || new Date(t).toISOString().slice(0, 19) + "Z" !== s)
    simpleError("time", "Real UTC Gregorian timestamp.");
  return t;
};
export const businessDeadline = (
  received: string,
  days: number,
  holidays: readonly string[],
): string => {
  bounded(days, "working days", 0, 1000);
  const t = utcStamp(received + "T00:00:00Z");
  if (holidays.length) unique(holidays, "holidays");
  holidays.forEach((v) => utcStamp(v + "T00:00:00Z"));
  let date = t,
    n = 0;
  while (n < days) {
    date += 86400000;
    const d = new Date(date),
      s = d.toISOString().slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s))
      simpleError(
        "date",
        "Working-day result must remain a four-digit Gregorian year.",
      );
    if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6 && !holidays.includes(s))
      n++;
  }
  return new Date(date).toISOString().slice(0, 10);
};
