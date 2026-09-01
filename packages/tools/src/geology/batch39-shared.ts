import { simpleError } from "../core/simple.js";
import {
  positive,
  nonnegative,
  aligned,
  binary,
  shape,
  bounded,
  unique,
  integer,
  sum,
  finite,
  strictlyIncreasing,
  linearFit,
} from "../engineering/batch38-shared.js";
export * from "../engineering/batch38-shared.js";
export const sequence = (values: readonly number[], field: string): void => {
  if (
    !values.length ||
    values.some((v, i) => !Number.isFinite(v) || (i > 0 && v < values[i - 1]))
  )
    simpleError(
      field,
      "Nonempty finite nondecreasing coordinates, signed values retained.",
    );
};
export const circular = (
  degrees: readonly number[],
  weights: readonly number[],
): { circularMeanDegrees: number; resultantConcentration: number } => {
  aligned(degrees, weights, "current observations");
  weights.forEach((v) => nonnegative(v, "weight"));
  if (degrees.some((v) => v < 0 || v >= 360))
    simpleError("azimuth", "Explicit 0 ≤ azimuth < 360 degree measurements.");
  const total = sum(weights);
  positive(total, "total observation weights");
  const x = sum(
      degrees.map(
        (v, i) => (Math.cos((v * Math.PI) / 180) * weights[i]) / total,
      ),
    ),
    y = sum(
      degrees.map(
        (v, i) => (Math.sin((v * Math.PI) / 180) * weights[i]) / total,
      ),
    ),
    r = Math.hypot(x, y);
  if (r < 1e-12)
    simpleError(
      "direction",
      "Unresolved canceling circular resultant; no unique mean direction.",
    );
  return {
    circularMeanDegrees: ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360,
    resultantConcentration: r,
  };
};
export const polygonClasses = (
  x: number,
  y: number,
  ids: readonly string[],
  vertices: readonly (readonly number[])[],
): string[] => {
  unique(ids, "class ids");
  if (
    ids.length > 64 ||
    shape(vertices, "vertices") !== 3 ||
    vertices.length > 128
  )
    simpleError(
      "polygons",
      "At most 64 caller classes and 128 vertices [index, x, y].",
    );
  const polys = ids.map((_, i) =>
    vertices.filter((v) => v[0] === i).map((v) => [v[1], v[2]]),
  );
  vertices.forEach((v) => bounded(v[0], "polygon index", 0, ids.length - 1));
  const cross = (
    a: readonly number[],
    b: readonly number[],
    c: readonly number[],
  ): number =>
    finite((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
  const onSegment = (
    a: readonly number[],
    b: readonly number[],
    c: readonly number[],
  ): boolean =>
    cross(a, b, c) === 0 &&
    c[0] >= Math.min(a[0], b[0]) &&
    c[0] <= Math.max(a[0], b[0]) &&
    c[1] >= Math.min(a[1], b[1]) &&
    c[1] <= Math.max(a[1], b[1]);
  for (const p of polys) {
    if (p.length > 1 && p[0][0] === p.at(-1)![0] && p[0][1] === p.at(-1)![1])
      p.pop();
    if (
      p.length < 3 ||
      new Set(p.map((v) => JSON.stringify(v))).size !== p.length
    )
      simpleError(
        "polygon",
        "At least three distinct vertices, only closing endpoint may repeat.",
      );
    if (sum(p.map((v, i) => cross(p[0], v, p[(i + 1) % p.length]))) === 0)
      simpleError("polygon", "Nonzero polygon area required.");
    for (let j = 0; j < p.length; j++)
      for (let k = j + 1; k < p.length; k++) {
        if (k === j + 1 || (j === 0 && k === p.length - 1)) continue;
        const a = p[j],
          b = p[(j + 1) % p.length],
          c = p[k],
          d = p[(k + 1) % p.length];
        const abC = cross(a, b, c),
          abD = cross(a, b, d),
          cdA = cross(c, d, a),
          cdB = cross(c, d, b);
        if (
          (Math.sign(abC) !== Math.sign(abD) &&
            Math.sign(cdA) !== Math.sign(cdB)) ||
          onSegment(a, b, c) ||
          onSegment(a, b, d) ||
          onSegment(c, d, a) ||
          onSegment(c, d, b)
        )
          simpleError(
            "polygon",
            "Simple non-self-intersecting caller polygons required.",
          );
      }
  }
  return ids.filter((_, i) => {
    const p = polys[i];
    if (p.length < 3)
      simpleError(
        "vertices",
        "At least three vertices per independently verified simple non-self-intersecting polygon.",
      );
    let inside = false;
    for (let j = 0, k = p.length - 1; j < p.length; k = j++) {
      const [a, b] = p[k],
        [c, d] = p[j],
        cross = finite((x - a) * (d - b) - (y - b) * (c - a));
      if (
        cross === 0 &&
        x >= Math.min(a, c) &&
        x <= Math.max(a, c) &&
        y >= Math.min(b, d) &&
        y <= Math.max(b, d)
      )
        return true;
      if (b > y !== d > y && x < finite(((c - a) * (y - b)) / (d - b) + a))
        inside = !inside;
    }
    return inside;
  });
};
export const evidenceClasses = (
  ids: readonly string[],
  requirements: readonly (readonly number[])[],
  observed: readonly number[],
  known: readonly number[],
): {
  compatibleCallerClasses: string[];
  fullyWitnessedCallerClasses: string[];
} => {
  unique(ids, "classes");
  aligned(ids, requirements, "criteria");
  aligned(observed, known, "evidence");
  binary(observed, "observed");
  binary(known, "known");
  if (shape(requirements, "requirements") !== observed.length)
    simpleError(
      "criteria",
      "One positive binary criterion per evidence column.",
    );
  requirements.forEach((row) => {
    binary(row, "requirement");
    if (!row.includes(1))
      simpleError(
        "criteria",
        "Each caller class requires at least one positive evidence witness.",
      );
  });
  return {
    compatibleCallerClasses: ids.filter((_, i) =>
      requirements[i].every((v, j) => !v || !known[j] || observed[j] === 1),
    ),
    fullyWitnessedCallerClasses: ids.filter((_, i) =>
      requirements[i].every(
        (v, j) => !v || (known[j] === 1 && observed[j] === 1),
      ),
    ),
  };
};
export const notice = (
  ids: readonly string[],
  texts: readonly string[],
  query: string,
): string => {
  aligned(ids, texts, "caller reference");
  unique(ids, "keys");
  if (texts.some((s) => !s.trim()))
    simpleError("notice", "Explicit verified reference text required.");
  const i = ids.indexOf(query);
  if (i < 0)
    simpleError(
      "query",
      "Unknown caller jurisdiction/site/method/edition, no inferred reference.",
    );
  return texts[i];
};
export const scoreTable = (
  scores: readonly number[],
  table: readonly (readonly number[])[],
  maxima: readonly number[],
): number => {
  if (
    scores.length !== 2 ||
    maxima.length !== 2 ||
    shape(table, "score table") !== maxima[1] ||
    table.length !== maxima[0]
  )
    simpleError(
      "table",
      "Caller explicitly verified full score-row/column table dimensions.",
    );
  scores.forEach((v, i) => bounded(v, "score", 1, maxima[i]));
  table.forEach((row) =>
    row.forEach((v) => bounded(v, "reference score", 1, 100)),
  );
  return table[scores[0] - 1][scores[1] - 1];
};
export const normalizeChi = (
  first: readonly number[],
  second: readonly number[],
): { pearsonStatistic: number; degreesOfFreedom: number } => {
  aligned(first, second, "grain counts");
  if (first.length < 2 || first.length > 128)
    simpleError("grains", "2–128 matched explicit count groups.");
  [...first, ...second].forEach((v) => bounded(v, "count", 0, 1000000000));
  const a = sum(first),
    b = sum(second);
  positive(a, "first total");
  positive(b, "second total");
  let chi = 0;
  first.forEach((v, i) => {
    const row = v + second[i];
    positive(row, "grain total");
    const ea = (row * a) / (a + b),
      eb = (row * b) / (a + b);
    chi = finite(chi + (v - ea) ** 2 / ea + (second[i] - eb) ** 2 / eb);
  });
  return { pearsonStatistic: chi, degreesOfFreedom: first.length - 1 };
};
export const cdfRanks = (
  reference: readonly number[],
  observed: number,
): { empiricalMidrankPercentile: number; referenceCount: number } => {
  if (!reference.length)
    simpleError(
      "reference",
      "Nonempty independently matched empirical reference population.",
    );
  const less = reference.filter((v) => v < observed).length,
    equal = reference.filter((v) => v === observed).length;
  return {
    empiricalMidrankPercentile: (100 * (less + equal / 2)) / reference.length,
    referenceCount: reference.length,
  };
};
export const contiguous = (
  values: readonly number[],
  weights: readonly number[],
  tolerance: number,
  minimumFraction: number,
): {
  observedPlateauStartIndex: number;
  observedPlateauEndIndex: number;
  observedPlateauWeightedAge: number;
  noQualifyingPlateau: boolean;
} => {
  aligned(values, weights, "steps");
  if (values.length > 128)
    simpleError("steps", "≤128 independently resolved step ages.");
  weights.forEach((v) => positive(v, "released fraction weight"));
  nonnegative(tolerance, "age tolerance");
  if (minimumFraction <= 0 || minimumFraction > 1)
    simpleError("fraction", "0<minimum plateau fraction≤1.");
  const total = sum(weights);
  let bestStart = -1,
    bestEnd = -1,
    bestWeight = 0,
    age = 0;
  for (let i = 0; i < values.length; i++) {
    let weight = 0,
      s = 0,
      lo = values[i],
      hi = values[i];
    for (let j = i; j < values.length; j++) {
      weight += weights[j];
      s = finite(s + values[j] * weights[j]);
      lo = Math.min(lo, values[j]);
      hi = Math.max(hi, values[j]);
      if (hi - lo > tolerance) break;
      if (
        j - i + 1 >= 3 &&
        weight / total >= minimumFraction &&
        weight > bestWeight
      ) {
        bestStart = i;
        bestEnd = j;
        bestWeight = weight;
        age = s / weight;
      }
    }
  }
  return {
    observedPlateauStartIndex: bestStart,
    observedPlateauEndIndex: bestEnd,
    observedPlateauWeightedAge: age,
    noQualifyingPlateau: bestStart < 0,
  };
};
export const janbu = (
  widths: readonly number[],
  weights: readonly number[],
  pressures: readonly number[],
  cohesions: readonly number[],
  frictionRadians: readonly number[],
  baseRadians: readonly number[],
  correction: number,
): { janbuSimplifiedFactor: number; equilibriumResidual: number } => {
  for (const values of [
    weights,
    pressures,
    cohesions,
    frictionRadians,
    baseRadians,
  ])
    aligned(widths, values, "slices");
  if (widths.length > 128)
    simpleError("slices", "≤128 independently chosen Janbu slices.");
  widths.forEach((v) => positive(v, "width"));
  weights.forEach((v) => positive(v, "weight"));
  pressures.forEach((v) => nonnegative(v, "pore pressure"));
  cohesions.forEach((v) => nonnegative(v, "cohesion"));
  positive(correction, "independent correction factor");
  frictionRadians.forEach((v) => {
    if (v < 0 || v >= Math.PI / 2) simpleError("friction", "0≤phi<π/2.");
  });
  baseRadians.forEach((v) => {
    if (Math.abs(v) >= Math.PI / 2) simpleError("base", "|alpha|<π/2.");
  });
  const drive = sum(weights.map((w, i) => w * Math.tan(baseRadians[i])));
  positive(drive, "positive net driving sum");
  const residual = (f: number) => {
    positive(f, "trial factor");
    return finite(
      correction *
        sum(
          widths.map((b, i) => {
            const a = baseRadians[i],
              tan = Math.tan(frictionRadians[i]),
              na = Math.cos(a) ** 2 * (1 + (Math.tan(a) * tan) / f);
            positive(na, "positive Janbu denominator branch");
            const effective = weights[i] - pressures[i] * b;
            nonnegative(effective, "non-tensile effective slice load");
            return finite((cohesions[i] * b + effective * tan) / na);
          }),
        ) -
        f * drive,
    );
  };
  const singularBoundary = Math.max(
    0,
    ...baseRadians.map((a, i) => -Math.tan(a) * Math.tan(frictionRadians[i])),
  );
  let lo = Math.max(
      1e-6,
      singularBoundary + Math.max(1e-12, singularBoundary * 1e-12),
    ),
    hi = 1e6,
    flo = residual(lo),
    fhi = residual(hi);
  if (lo >= hi || flo < 0 || fhi > 0)
    simpleError(
      "bracket",
      "Positive Janbu root must be independently within 1e-6..1e6; no assumed converged solution.",
    );
  for (let i = 0; i < 120; i++) {
    const mid = lo / 2 + hi / 2,
      f = residual(mid);
    if (f > 0) lo = mid;
    else hi = mid;
  }
  const factor = lo / 2 + hi / 2;
  return {
    janbuSimplifiedFactor: factor,
    equilibriumResidual: residual(factor),
  };
};
