import {
  simpleError,
  aligned,
  positive,
  nonnegative,
  finite,
  strictlyIncreasing,
  sum,
  mean,
  binary,
  unique,
  bounded,
} from "../neuroscience/batch47-shared.js";
export * from "../neuroscience/batch47-shared.js";
export const trapezoid = (
  x: readonly number[],
  y: readonly number[],
): number => {
  aligned(x, y, "trace");
  strictlyIncreasing(x, "coordinates", 2);
  return finite(
    sum(x.slice(1).map((v, i) => ((v - x[i]) * (y[i] + y[i + 1])) / 2)),
  );
};
export const fit = (
  x: readonly number[],
  y: readonly number[],
): { slope: number; intercept: number } => {
  aligned(x, y, "fit");
  if (x.length < 2) simpleError("fit", "At least two actual observations.");
  const a = mean(x),
    b = mean(y),
    v = positive(sum(x.map((t) => (t - a) ** 2)), "coordinate-variance"),
    s = finite(sum(x.map((t, i) => (t - a) * (y[i] - b))) / v);
  return { slope: s, intercept: finite(b - s * a) };
};
export const slopePair = (
  x: readonly number[],
  y: readonly number[],
): number => {
  aligned(x, y, "pair");
  if (x.length !== 2 || x[0] === x[1])
    simpleError("pair", "Exactly two distinct matched coordinates.");
  return finite((y[1] - y[0]) / (x[1] - x[0]));
};
export const weightedMean = (
  x: readonly number[],
  w: readonly number[],
): number => {
  aligned(x, w, "weights");
  w.forEach((v) => nonnegative(v, "weight"));
  return finite(
    sum(x.map((v, i) => v * w[i])) / positive(sum(w), "total-weight"),
  );
};
export const expFinite = (x: number): number => {
  const v = Math.exp(x);
  if (!Number.isFinite(v) || v === 0)
    simpleError(
      "exponential",
      "Representable nonzero exponential required; no silent underflow.",
    );
  return v;
};
export const sigmoid = (x: number): number =>
  x >= 0 ? 1 / (1 + Math.exp(-x)) : Math.exp(x) / (1 + Math.exp(x));
export const inventory = (
  ids: readonly string[],
  values: readonly number[],
  known: readonly number[],
): { knownTotal: number; knownIds: string[]; unknownIds: string[] } => {
  unique(ids, "inventory");
  aligned(ids, values, "values");
  aligned(ids, known, "known");
  binary(known, "known");
  values.forEach((v) => nonnegative(v, "quantity"));
  return {
    knownTotal: sum(values.map((v, i) => v * known[i])),
    knownIds: ids.filter((_, i) => known[i]),
    unknownIds: ids.filter((_, i) => !known[i]),
  };
};
export const criterionTable = (
  value: number,
  lower: readonly number[],
  upper: readonly number[],
  labels: readonly string[],
): string[] => {
  unique(labels, "bands");
  aligned(labels, lower, "lower");
  aligned(labels, upper, "upper");
  if (lower.some((v, i) => v >= upper[i]))
    simpleError(
      "bands",
      "Actual positive-width independent half-open reference bands.",
    );
  return labels.filter((_, i) => value >= lower[i] && value < upper[i]);
};
export const logEndpoint = (
  d: readonly number[],
  p: readonly number[],
  target: number,
): number => {
  aligned(d, p, "response");
  strictlyIncreasing(d, "dose", 2);
  d.forEach((v) => positive(v, "dose"));
  p.forEach((v, i) => {
    if (v < 0 || v > 1 || (i && v < p[i - 1]))
      simpleError("response", "Actual monotone endpoint fractions 0–1.");
  });
  if (target <= 0 || target >= 1 || target < p[0] || target > p.at(-1)!)
    simpleError(
      "target",
      "Interior response target bracketed by observations, no extrapolation.",
    );
  const exact = p.flatMap((v, i) => (v === target ? [i] : []));
  if (exact.length > 1)
    simpleError("target", "Plateau does not uniquely identify endpoint dose.");
  if (exact.length === 1) return d[exact[0]];
  const i = p.findIndex((v) => v > target) - 1;
  return expFinite(
    Math.log(d[i]) +
      ((Math.log(d[i + 1]) - Math.log(d[i])) * (target - p[i])) /
        (p[i + 1] - p[i]),
  );
};
export const assignRoles = (
  names: readonly string[],
  roles: readonly string[],
  offset: number,
): { participantIds: string[]; assignedRoleIds: string[] } => {
  unique(names, "participants");
  unique(roles, "roles");
  if (names.length !== roles.length)
    simpleError(
      "assignment",
      "Same-sized independently assigned team/role inventories.",
    );
  bounded(offset, "rotation", 0, 1000000);
  return {
    participantIds: [...names],
    assignedRoleIds: names.map((_, i) => roles[(i + offset) % roles.length]),
  };
};
export const loopSurvey = (
  shots: readonly (readonly number[])[],
): {
  signedClosureMeters: number[];
  observedClosureMagnitudeMeters: number;
  observedSurveyedLengthMeters: number;
} => {
  if (!shots.length || shots.some((r) => r.length !== 3))
    simpleError("shots", "Actual distance, azimuth, inclination triplets.");
  const xyz = [0, 0, 0];
  let length = 0;
  for (const [d, a, i] of shots) {
    nonnegative(d, "distance");
    if (a < 0 || a >= 360 || Math.abs(i) > 90)
      simpleError(
        "angle",
        "Azimuth must be in [0, 360) degrees and inclination in [-90, 90] degrees.",
      );
    length += d;
    xyz[0] += d * Math.cos((i * Math.PI) / 180) * Math.sin((a * Math.PI) / 180);
    xyz[1] += d * Math.cos((i * Math.PI) / 180) * Math.cos((a * Math.PI) / 180);
    xyz[2] += d * Math.sin((i * Math.PI) / 180);
  }
  return {
    signedClosureMeters: xyz,
    observedClosureMagnitudeMeters: Math.hypot(...xyz),
    observedSurveyedLengthMeters: length,
  };
};
export const ranking = (
  ids: readonly string[],
  values: readonly number[],
  known: readonly number[],
): {
  rankedKnownIds: string[];
  competitionRanks: number[];
  unknownIds: string[];
} => {
  unique(ids, "records");
  aligned(ids, values, "values");
  aligned(ids, known, "known");
  binary(known, "known");
  values.forEach((v) => nonnegative(v, "record"));
  const ii = ids
    .flatMap((_, i) => (known[i] ? [i] : []))
    .sort((a, b) => values[b] - values[a]);
  return {
    rankedKnownIds: ii.map((i) => ids[i]),
    competitionRanks: ii.map(
      (i) => 1 + ii.filter((k) => values[k] > values[i]).length,
    ),
    unknownIds: ids.filter((_, i) => !known[i]),
  };
};
export const polygonArea = (p: readonly (readonly number[])[]): number => {
  if (p.length < 3 || p.length > 128 || p.some((r) => r.length !== 2))
    simpleError(
      "polygon",
      "3–128 ordered independently verified simple boundary xy vertices, no holes.",
    );
  for (let i = 0; i < p.length; i++)
    for (let j = i + 1; j < p.length; j++)
      if (p[i][0] === p[j][0] && p[i][1] === p[j][1])
        simpleError("polygon", "Distinct boundary vertices, closure implicit.");
  const cross = (
    a: readonly number[],
    b: readonly number[],
    c: readonly number[],
  ) => finite((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
  const between = (
    a: readonly number[],
    b: readonly number[],
    c: readonly number[],
  ) =>
    cross(a, b, c) === 0 &&
    c[0] >= Math.min(a[0], b[0]) &&
    c[0] <= Math.max(a[0], b[0]) &&
    c[1] >= Math.min(a[1], b[1]) &&
    c[1] <= Math.max(a[1], b[1]);
  for (let i = 0; i < p.length; i++)
    for (let j = i + 2; j < p.length; j++) {
      if (i === 0 && j === p.length - 1) continue;
      const a = p[i],
        b = p[(i + 1) % p.length],
        c = p[j],
        d = p[(j + 1) % p.length],
        u = cross(a, b, c),
        v = cross(a, b, d),
        w = cross(c, d, a),
        x = cross(c, d, b);
      if (
        (Math.sign(u) !== Math.sign(v) &&
          Math.sign(w) !== Math.sign(x) &&
          u !== 0 &&
          v !== 0 &&
          w !== 0 &&
          x !== 0) ||
        between(a, b, c) ||
        between(a, b, d) ||
        between(c, d, a) ||
        between(c, d, b)
      )
        simpleError(
          "polygon",
          "Simple non-self-intersecting passage boundary.",
        );
    }
  return positive(
    Math.abs(
      sum(
        p.map(
          (v, i) =>
            v[0] * p[(i + 1) % p.length][1] - v[1] * p[(i + 1) % p.length][0],
        ),
      ),
    ) / 2,
    "polygonarea",
  );
};
export const weightedTranslation = (
  residuals: readonly (readonly number[])[],
  weights: readonly number[],
): { fittedTranslation: number[]; postAdjustmentResiduals: number[][] } => {
  aligned(residuals, weights, "weights");
  if (!residuals.length || residuals.some((r) => r.length !== 3))
    simpleError(
      "residuals",
      "Actual observed 3D common-translation residuals.",
    );
  const t = [0, 1, 2].map((i) =>
    weightedMean(
      residuals.map((r) => r[i]),
      weights,
    ),
  );
  return {
    fittedTranslation: t,
    postAdjustmentResiduals: residuals.map((r) => r.map((v, i) => v - t[i])),
  };
};
