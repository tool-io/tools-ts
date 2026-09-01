import { simpleError } from "../core/simple.js";
import {
  positive,
  nonnegative,
  aligned,
  shape,
  bounded,
} from "../game/shared.js";
import { sum, mean } from "../horticulture/batch34-shared.js";
import { finite } from "../plumbing/batch35-shared.js";
import {
  strictlyIncreasing,
  interpolate,
} from "../glaciology/batch32-shared.js";
export * from "../forestry/batch37-shared.js";
export const solve = (
  a: readonly (readonly number[])[],
  b: readonly number[],
): number[] => {
  const n = shape(a, "matrix");
  if (n !== a.length || n > 32 || b.length !== n)
    simpleError(
      "system",
      "Dense square1–32 matrix and matched right hand side required.",
    );
  const scales = a.map((r) => Math.max(...r.map(Math.abs)));
  scales.forEach((v) => positive(v, "row norm"));
  const m = a.map((r, i) => [
    ...r.map((v) => v / scales[i]),
    finite(b[i] / scales[i]),
  ]);
  for (let k = 0; k < n; k++) {
    let p = k;
    for (let i = k + 1; i < n; i++)
      if (Math.abs(m[i][k]) > Math.abs(m[p][k])) p = i;
    if (Math.abs(m[p][k]) < 1e-12)
      simpleError(
        "system",
        "Singular or numerically unresolved normalized pivot.",
      );
    [m[k], m[p]] = [m[p], m[k]];
    const pivot = m[k][k];
    for (let j = k; j <= n; j++) m[k][j] = finite(m[k][j] / pivot);
    for (let i = 0; i < n; i++)
      if (i !== k) {
        const f = m[i][k];
        for (let j = k; j <= n; j++) m[i][j] = finite(m[i][j] - f * m[k][j]);
      }
  }
  return m.map((r) => r[n]);
};
export const fullCircle = (
  points: readonly (readonly number[])[],
): { center: number[]; radius: number; radialRmse: number } => {
  if (shape(points, "points") !== 2 || points.length < 3 || points.length > 128)
    simpleError("pattern", "3–128 noncollinear measured planar centers.");
  const x0 = points[0][0],
    y0 = points[0][1],
    p = points.map(([x, y]) => [finite(x - x0), finite(y - y0)]),
    scale = Math.max(...p.flat().map(Math.abs));
  positive(scale, "pattern extent");
  const q = p.map(([x, y]) => [x / scale, y / scale]);
  const features = q.map(([x, y]) => [2 * x, 2 * y, 1]);
  const rhs = q.map(([x, y]) => x * x + y * y);
  const ata = [0, 1, 2].map((i) =>
      [0, 1, 2].map((j) => sum(features.map((v) => v[i] * v[j]))),
    ),
    atb = [0, 1, 2].map((i) => sum(features.map((v, j) => v[i] * rhs[j])));
  const [cx, cy, c] = solve(ata, atb),
    radius = scale * Math.sqrt(c + cx * cx + cy * cy);
  positive(radius, "radius");
  const center = [x0 + cx * scale, y0 + cy * scale];
  return {
    center,
    radius,
    radialRmse: Math.sqrt(
      mean(
        points.map(
          ([x, y]) => (Math.hypot(x - center[0], y - center[1]) - radius) ** 2,
        ),
      ),
    ),
  };
};
export const profileRa = (
  x: readonly number[],
  z: readonly number[],
): number => {
  aligned(x, z, "profile");
  strictlyIncreasing(x, "positions");
  const lengths = x.slice(1).map((v, i) => finite(v - x[i])),
    total = sum(lengths);
  positive(total, "length");
  const center =
    sum(lengths.map((v, i) => v * (z[i] / 2 + z[i + 1] / 2))) / total;
  return (
    sum(
      lengths.map((length, i) => {
        const a = z[i] - center,
          b = z[i + 1] - center;
        if (a === 0 || b === 0 || Math.sign(a) === Math.sign(b))
          return length * (Math.abs(a) / 2 + Math.abs(b) / 2);
        const s = Math.max(Math.abs(a), Math.abs(b)),
          aa = Math.abs(a) / s,
          bb = Math.abs(b) / s;
        return (length * s * (aa * aa + bb * bb)) / (2 * (aa + bb));
      }),
    ) / total
  );
};
export const hardy = (
  q: readonly number[],
  r: readonly number[],
  powers: readonly number[],
): number => {
  aligned(q, r, "loop");
  aligned(q, powers, "exponents");
  r.forEach((v) => positive(v, "resistance"));
  powers.forEach((v) => {
    if (v < 1 || v > 3) simpleError("exponent", "1≤flow exponent≤3.");
  });
  const head = sum(
      q.map((v, i) => r[i] * Math.sign(v) * Math.abs(v) ** powers[i]),
    ),
    derivative = sum(
      q.map((v, i) => r[i] * powers[i] * Math.abs(v) ** (powers[i] - 1)),
    );
  positive(derivative, "nonzero loop derivative");
  return finite(-head / derivative);
};
export const muskingum = (
  inflow: readonly number[],
  initial: number,
  k: number,
  x: number,
  dt: number,
): number[] => {
  positive(k, "K");
  positive(dt, "dt");
  nonnegative(initial, "initial outflow");
  const scaledStep = finite(dt / k);
  if (
    !inflow.length ||
    x < 0 ||
    x > 0.5 ||
    scaledStep < 2 * x ||
    scaledStep > 2 * (1 - x)
  )
    simpleError(
      "routing",
      "0 ≤ X ≤ 0.5 and 2KX ≤ dt ≤ 2K(1 − X); nonnegative Muskingum coefficients required.",
    );
  inflow.forEach((v) => nonnegative(v, "inflow"));
  const denominator = 2 * (1 - x) + scaledStep,
    c0 = (scaledStep - 2 * x) / denominator,
    c1 = (scaledStep + 2 * x) / denominator,
    c2 = (2 * (1 - x) - scaledStep) / denominator,
    out = [initial];
  for (let i = 1; i < inflow.length; i++)
    out.push(finite(c0 * inflow[i] + c1 * inflow[i - 1] + c2 * out[i - 1]));
  return out;
};
export const intervalRuns = (
  times: readonly number[],
  flags: readonly number[],
): {
  runStartCoordinates: number[];
  runEndCoordinates: number[];
  openLastRun: boolean;
} => {
  aligned(times, flags, "trace");
  strictlyIncreasing(times, "times", 1);
  if (flags.some((v) => v !== 0 && v !== 1))
    simpleError("flags", "Explicit binary trace required.");
  const starts: number[] = [],
    ends: number[] = [];
  for (let i = 0; i < flags.length; i++) {
    if (flags[i] && (i === 0 || !flags[i - 1])) starts.push(times[i]);
    if (!flags[i] && i > 0 && flags[i - 1]) ends.push(times[i]);
  }
  return {
    runStartCoordinates: starts,
    runEndCoordinates: ends,
    openLastRun: flags.at(-1) === 1,
  };
};
export const windowBounds = (
  starts: readonly number[],
  ends: readonly number[],
  offsets: readonly number[],
): {
  commonWindowStart: number;
  commonWindowEnd: number;
  signedCommonBandwidth: number;
} => {
  aligned(starts, ends, "greens");
  aligned(starts, offsets, "travel");
  starts.forEach((v, i) => {
    if (v > ends[i])
      simpleError("green", "Ordered unwrapped explicit green window.");
  });
  const left = Math.max(...starts.map((v, i) => finite(v - offsets[i]))),
    right = Math.min(...ends.map((v, i) => finite(v - offsets[i])));
  return {
    commonWindowStart: left,
    commonWindowEnd: right,
    signedCommonBandwidth: finite(right - left),
  };
};
export const navier = (
  a: number,
  b: number,
  d: number,
  load: number,
  x: number,
  y: number,
  terms: number,
): number => {
  positive(a, "a");
  positive(b, "b");
  positive(d, "rigidity");
  bounded(terms, "odd terms", 1, 32);
  if (x < 0 || x > a || y < 0 || y > b)
    simpleError("point", "Query inside simply supported rectangular plate.");
  let w = 0;
  for (let i = 0; i < terms; i++)
    for (let j = 0; j < terms; j++) {
      const m = 2 * i + 1,
        n = 2 * j + 1;
      const denominator = positive(
        Math.PI ** 6 * d * m * n * ((m / a) ** 2 + (n / b) ** 2) ** 2,
        "finite resolved Navier modal denominator",
      );
      w = finite(
        w +
          (16 *
            load *
            Math.sin((m * Math.PI * x) / a) *
            Math.sin((n * Math.PI * y) / b)) /
            denominator,
      );
    }
  return w;
};
export const nyquist = (
  real: readonly number[],
  imaginary: readonly number[],
): number => {
  aligned(real, imaginary, "Nyquist");
  if (
    real.length < 4 ||
    real[0] !== real.at(-1) ||
    imaginary[0] !== imaginary.at(-1)
  )
    simpleError(
      "contour",
      "Explicit closed Nyquist polygon, first=last, ≥4 samples.",
    );
  let angle = 0;
  for (let i = 0; i < real.length - 1; i++) {
    const a = real[i] + 1,
      b = imaginary[i],
      c = real[i + 1] + 1,
      d = imaginary[i + 1],
      scale = Math.max(Math.abs(a), Math.abs(b), Math.abs(c), Math.abs(d));
    positive(scale, "critical point");
    const ax = a / scale,
      ay = b / scale,
      bx = c / scale,
      by = d / scale;
    const cross = ax * by - ay * bx,
      dot = ax * bx + ay * by;
    if (
      Math.hypot(ax, ay) < 1e-12 ||
      Math.hypot(bx, by) < 1e-12 ||
      (Math.abs(cross) < 1e-12 && dot <= 0)
    )
      simpleError(
        "contour",
        "Sample or segment through critical point−1 is unresolved.",
      );
    angle += Math.atan2(cross, dot);
  }
  const winding = Math.round(angle / (2 * Math.PI));
  if (Math.abs(angle / (2 * Math.PI) - winding) > 1e-8)
    simpleError("contour", "Unresolved sampled winding.");
  return winding;
};
export const rootStationary = (
  poles: readonly number[],
  zeros: readonly number[],
  lo: number,
  hi: number,
): { stationaryPoint: number; gain: number } => {
  if (
    lo >= hi ||
    poles.length === 0 ||
    poles.length > 32 ||
    zeros.length > 32 ||
    [...poles, ...zeros].some((v) => v >= lo && v <= hi)
  )
    simpleError(
      "branch",
      "Ordered bracket without poles/zeros, ≤32 each; real branch chosen independently.",
    );
  const slope = (s: number) =>
    finite(
      sum(poles.map((p) => 1 / finite(s - p))) -
        sum(zeros.map((z) => 1 / finite(s - z))),
    );
  let a = lo,
    b = hi,
    fa = slope(a),
    fb = slope(b);
  if (!(fa === 0 || fb === 0 || Math.sign(fa) !== Math.sign(fb)))
    simpleError("bracket", "Opposite stationary residual signs required.");
  if (fa === 0 && fb === 0)
    simpleError(
      "bracket",
      "Non-isolated stationary residual requires independent branch resolution.",
    );
  for (let i = 0; i < 100 && a !== b; i++) {
    const mid = a / 2 + b / 2,
      f = slope(mid);
    if (f === 0) {
      a = b = mid;
      break;
    }
    if (Math.sign(f) === Math.sign(fa)) {
      a = mid;
      fa = f;
    } else b = mid;
  }
  const s = a / 2 + b / 2,
    n = poles.reduce((v, p) => finite(v * (s - p)), 1),
    d = zeros.reduce((v, z) => finite(v * (s - z)), 1),
    gain = -n / d;
  nonnegative(gain, "positive gain branch");
  return { stationaryPoint: s, gain };
};
export const mccabe = (
  xs: readonly number[],
  ys: readonly number[],
  xd: number,
  xb: number,
  reflux: number,
  maximum: number,
): { stageLiquidCompositions: number[]; reachedBottom: boolean } => {
  aligned(xs, ys, "equilibrium");
  strictlyIncreasing(xs, "liquid");
  strictlyIncreasing(ys, "vapor");
  if (
    xs.some((v) => v < 0 || v > 1) ||
    ys.some((v) => v < 0 || v > 1) ||
    xb < xs[0] ||
    xd > xs.at(-1)! ||
    xb >= xd
  )
    simpleError(
      "compositions",
      "Explicit monotone equilibrium and bottom<distillate within calibration.",
    );
  nonnegative(reflux, "reflux");
  bounded(maximum, "stages", 1, 128);
  const out: number[] = [],
    slope = reflux / (reflux + 1),
    intercept = xd / (reflux + 1);
  let y = xd;
  for (let i = 0; i < maximum; i++) {
    const x = interpolate(ys, xs, y);
    out.push(x);
    if (x <= xb) return { stageLiquidCompositions: out, reachedBottom: true };
    const next = slope * x + intercept;
    if (next >= y)
      simpleError(
        "pinch",
        "Nonprogressing rectifying-only operating-line stage, feed/stripping section not modeled.",
      );
    y = next;
  }
  return { stageLiquidCompositions: out, reachedBottom: false };
};
