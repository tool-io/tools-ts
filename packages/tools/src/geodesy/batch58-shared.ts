import * as B from "../binary/batch54-shared.js";
export {
  validate,
  check,
  int,
  positive,
  num,
  str,
  records,
  arr,
  unique,
  dense,
  mod,
} from "../binary/batch54-shared.js";
export const rad = (x: number): number => (x * Math.PI) / 180;
export const deg = (x: number): number => (x * 180) / Math.PI;
export const latitude = (x: number, poles = true): number => {
  B.check(Math.abs(x) <= (poles ? 90 : 89.9999));
  return rad(x);
};
export const longitude = (x: number): number => {
  B.check(Math.abs(x) <= 180);
  return rad(x);
};
export const lonDegrees = (x: number): number => B.mod(deg(x) + 180, 360) - 180;
export const bearing = (x: number): number => B.mod(deg(x), 360);
export const magnitude = (x: number, max = 1e9): number => {
  B.check(Math.abs(x) <= max);
  return x;
};
export const axes = (
  a: number,
  b: number,
): { a: number; b: number; f: number; e2: number; e: number } => {
  B.check(
    a >= 1 && a <= 1e8 && b > 0 && b <= a && b / a >= 0.9,
    "Oblate/spherical axes, 0.9a<=b<=a, required",
  );
  const f = (a - b) / a,
    e2 = f * (2 - f);
  return { a, b, f, e2, e: Math.sqrt(e2) };
};
export const ellipsoid = (
  a: number,
  f: number,
): { a: number; b: number; f: number; e2: number; e: number } => {
  B.check(
    a >= 1 && a <= 1e8 && f >= 0 && f <= 0.02,
    "Finite oblate/spherical ellipsoid with 0<=f<=0.02 required",
  );
  return { a, b: a * (1 - f), f, e2: f * (2 - f), e: Math.sqrt(f * (2 - f)) };
};
export const radii = (
  a: number,
  f: number,
  phi: number,
): { prime: number; meridian: number } => {
  const p = ellipsoid(a, f),
    d = 1 - p.e2 * Math.sin(phi) ** 2;
  return { prime: a / Math.sqrt(d), meridian: (a * (1 - p.e2)) / d ** 1.5 };
};
export const integrate = (
  fn: (x: number) => number,
  left: number,
  right: number,
): number => {
  if (left === right) return 0;
  const n = 1024,
    h = (right - left) / n;
  let s = fn(left) + fn(right);
  for (let j = 1; j < n; j++) s += (j % 2 ? 4 : 2) * fn(left + j * h);
  return (s * h) / 3;
};
export const meridianArc = (a: number, f: number, phi: number): number =>
  integrate((x) => radii(a, f, x).meridian, 0, phi);
export const authalicQ = (f: number, phi: number): number => {
  const e2 = f * (2 - f),
    e = Math.sqrt(e2),
    s = Math.sin(phi);
  return e === 0
    ? 2 * s
    : (1 - e2) * (s / (1 - e2 * s * s) + Math.atanh(e * s) / e);
};
export const isometric = (f: number, phi: number): number => {
  const e = Math.sqrt(f * (2 - f));
  return Math.asinh(Math.tan(phi)) - e * Math.atanh(e * Math.sin(phi));
};
export const authalicRadius = (a: number, f: number): number =>
  a * Math.sqrt(authalicQ(f, Math.PI / 2) / 2);
export const forwardEcef = (
  a: number,
  f: number,
  phi: number,
  lam: number,
  h: number,
): number[] => {
  ellipsoid(a, f);
  magnitude(h, 1e9);
  B.check(h >= -0.1 * a);
  const e2 = f * (2 - f),
    n = radii(a, f, phi).prime,
    c = Math.abs(Math.abs(phi) - Math.PI / 2) < 1e-15 ? 0 : Math.cos(phi);
  return [
    (n + h) * c * Math.cos(lam),
    (n + h) * c * Math.sin(lam),
    (n * (1 - e2) + h) * Math.sin(phi),
  ];
};
export const vector3 = (p: readonly number[]): void => {
  B.check(p.length === 3);
  p.forEach((x) => magnitude(x));
};
export const reverseEcef = (
  a: number,
  f: number,
  v: readonly number[],
  bowring = false,
): {
  latitudeDegrees: number;
  longitudeDegrees: number;
  ellipsoidalHeightMeters: number;
  iterations: number;
  residualMeters: number;
  converged: boolean;
} => {
  const e = ellipsoid(a, f);
  vector3(v);
  const [x, y, z] = v,
    p = Math.hypot(x, y),
    r = Math.hypot(...v);
  B.check(
    r >= a / 2 && r <= 1e9,
    "Deep-interior/multiple-normal ECEF solutions are outside this bounded converter",
  );
  const lam = p === 0 ? 0 : Math.atan2(y, x);
  let phi: number;
  if (p === 0) phi = (Math.sign(z) * Math.PI) / 2;
  else if (bowring) {
    const beta = Math.atan2(a * z, e.b * p);
    phi = Math.atan2(
      z + (e.e2 / (1 - e.e2)) * e.b * Math.sin(beta) ** 3,
      p - e.e2 * a * Math.cos(beta) ** 3,
    );
  } else phi = Math.atan2(z, p * (1 - e.e2));
  let iterations = 0;
  for (; iterations < 32; iterations++) {
    const next = Math.atan2(
      z + e.e2 * radii(a, f, phi).prime * Math.sin(phi),
      p,
    );
    if (Math.abs(next - phi) < 1e-14) {
      phi = next;
      iterations++;
      break;
    }
    phi = next;
  }
  const h =
      p * Math.cos(phi) +
      z * Math.sin(phi) -
      a * Math.sqrt(1 - e.e2 * Math.sin(phi) ** 2),
    w = forwardEcefUnrestricted(a, f, phi, lam, h),
    residual = Math.hypot(...w.map((u, j) => u - v[j]));
  return {
    latitudeDegrees: deg(phi),
    longitudeDegrees: lonDegrees(lam),
    ellipsoidalHeightMeters: h,
    iterations,
    residualMeters: residual,
    converged: residual <= Math.max(1e-6, r * 1e-13),
  };
};
const forwardEcefUnrestricted = (
  a: number,
  f: number,
  phi: number,
  lam: number,
  h: number,
): number[] => {
  const n = radii(a, f, phi).prime,
    e2 = f * (2 - f);
  return [
    (n + h) * Math.cos(phi) * Math.cos(lam),
    (n + h) * Math.cos(phi) * Math.sin(lam),
    (n * (1 - e2) + h) * Math.sin(phi),
  ];
};
// Vincenty (1975): bounded iteration; nonconvergence never becomes a fake
// spherical distance. End bearings are forward tangents, not back azimuths.
export const vincentyInverse = (
  a: number,
  f: number,
  p1: number,
  l1: number,
  p2: number,
  l2: number,
): Record<string, unknown> => {
  const b = ellipsoid(a, f).b,
    L = B.mod(l2 - l1 + Math.PI, 2 * Math.PI) - Math.PI,
    U1 = Math.atan((1 - f) * Math.tan(p1)),
    U2 = Math.atan((1 - f) * Math.tan(p2)),
    s1 = Math.sin(U1),
    c1 = Math.cos(U1),
    s2 = Math.sin(U2),
    c2 = Math.cos(U2);
  if ((p1 === p2 && L === 0) || (p1 === p2 && Math.abs(p1) === Math.PI / 2))
    return {
      converged: true,
      iterations: 0,
      distanceMeters: 0,
      initialBearingDegrees: null,
      finalBearingDegrees: null,
    };
  if (
    Math.abs(p1 + p2) < 1e-15 &&
    (Math.abs(Math.abs(L) - Math.PI) < 1e-15 || Math.abs(p1) === Math.PI / 2)
  )
    return {
      converged: false,
      iterations: 0,
      distanceMeters: null,
      initialBearingDegrees: null,
      finalBearingDegrees: null,
      reason:
        "Antipodal endpoints have no unique azimuth; no spherical fallback",
    };
  let lam = L,
    sinSigma = 0,
    cosSigma = 0,
    sigma = 0,
    sinAlpha = 0,
    cos2Alpha = 0,
    cos2SigmaM = 0,
    iterations = 0,
    converged = false;
  for (; iterations < 200; iterations++) {
    sinSigma = Math.hypot(
      c2 * Math.sin(lam),
      c1 * s2 - s1 * c2 * Math.cos(lam),
    );
    cosSigma = s1 * s2 + c1 * c2 * Math.cos(lam);
    if (sinSigma === 0) break;
    sigma = Math.atan2(sinSigma, cosSigma);
    sinAlpha = (c1 * c2 * Math.sin(lam)) / sinSigma;
    cos2Alpha = Math.max(0, 1 - sinAlpha * sinAlpha);
    cos2SigmaM = cos2Alpha < 1e-24 ? 0 : cosSigma - (2 * s1 * s2) / cos2Alpha;
    const C = (f / 16) * cos2Alpha * (4 + f * (4 - 3 * cos2Alpha)),
      next =
        L +
        (1 - C) *
          f *
          sinAlpha *
          (sigma +
            C *
              sinSigma *
              (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM ** 2)));
    if (Math.abs(next - lam) < 1e-13) {
      lam = next;
      converged = true;
      iterations++;
      break;
    }
    lam = next;
  }
  if (!converged)
    return {
      converged: false,
      iterations,
      distanceMeters: null,
      initialBearingDegrees: null,
      finalBearingDegrees: null,
      reason: "Vincenty iteration did not converge; no spherical fallback",
    };
  const u2 = (cos2Alpha * (a * a - b * b)) / (b * b),
    A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2))),
    Bv = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2))),
    delta =
      Bv *
      sinSigma *
      (cos2SigmaM +
        (Bv / 4) *
          (cosSigma * (-1 + 2 * cos2SigmaM ** 2) -
            (Bv / 6) *
              cos2SigmaM *
              (-3 + 4 * sinSigma ** 2) *
              (-3 + 4 * cos2SigmaM ** 2)));
  return {
    converged: true,
    iterations,
    distanceMeters: b * A * (sigma - delta),
    initialBearingDegrees: bearing(
      Math.atan2(c2 * Math.sin(lam), c1 * s2 - s1 * c2 * Math.cos(lam)),
    ),
    finalBearingDegrees: bearing(
      Math.atan2(c1 * Math.sin(lam), -s1 * c2 + c1 * s2 * Math.cos(lam)),
    ),
  };
};
export const vincentyDirect = (
  a: number,
  f: number,
  phi: number,
  lam: number,
  az: number,
  distance: number,
): Record<string, unknown> => {
  const b = ellipsoid(a, f).b;
  B.check(distance >= 0 && distance <= Math.PI * a);
  if (distance === 0)
    return {
      converged: true,
      iterations: 0,
      latitudeDegrees: deg(phi),
      longitudeDegrees: lonDegrees(lam),
      finalBearingDegrees: null,
    };
  const U = Math.atan((1 - f) * Math.tan(phi)),
    su = Math.sin(U),
    cu = Math.cos(U),
    sigma1 = Math.atan2(Math.tan(U), Math.cos(az)),
    sinAlpha = cu * Math.sin(az),
    cos2Alpha = 1 - sinAlpha * sinAlpha,
    u2 = (cos2Alpha * (a * a - b * b)) / (b * b),
    A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2))),
    Bv = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
  let sigma = distance / (b * A),
    iterations = 0,
    converged = false;
  for (; iterations < 200; iterations++) {
    const cm = Math.cos(2 * sigma1 + sigma),
      ss = Math.sin(sigma),
      cs = Math.cos(sigma),
      delta =
        Bv *
        ss *
        (cm +
          (Bv / 4) *
            (cs * (-1 + 2 * cm ** 2) -
              (Bv / 6) * cm * (-3 + 4 * ss ** 2) * (-3 + 4 * cm ** 2))),
      next = distance / (b * A) + delta;
    if (Math.abs(next - sigma) < 1e-13) {
      sigma = next;
      converged = true;
      iterations++;
      break;
    }
    sigma = next;
  }
  if (!converged)
    return {
      converged: false,
      iterations,
      latitudeDegrees: null,
      longitudeDegrees: null,
      finalBearingDegrees: null,
    };
  const ss = Math.sin(sigma),
    cs = Math.cos(sigma),
    tmp = su * ss - cu * cs * Math.cos(az),
    lat = Math.atan2(
      su * cs + cu * ss * Math.cos(az),
      (1 - f) * Math.hypot(sinAlpha, tmp),
    ),
    lambda = Math.atan2(ss * Math.sin(az), cu * cs - su * ss * Math.cos(az)),
    C = (f / 16) * cos2Alpha * (4 + f * (4 - 3 * cos2Alpha)),
    L =
      lambda -
      (1 - C) *
        f *
        sinAlpha *
        (sigma +
          C *
            ss *
            (Math.cos(2 * sigma1 + sigma) +
              C * cs * (-1 + 2 * Math.cos(2 * sigma1 + sigma) ** 2)));
  return {
    converged: true,
    iterations,
    latitudeDegrees: deg(lat),
    longitudeDegrees: lonDegrees(lam + L),
    finalBearingDegrees: bearing(Math.atan2(sinAlpha, -tmp)),
  };
};
export const helmert = (
  v: readonly number[],
  t: readonly number[],
  rot: readonly number[],
  ppm: number,
  convention: string,
): number[] => {
  vector3(v);
  vector3(t);
  vector3(rot);
  B.check(
    Math.abs(ppm) <= 1000 &&
      rot.every((x) => Math.abs(x) <= 60) &&
      ["position-vector", "coordinate-frame"].includes(convention),
  );
  const sign = convention === "position-vector" ? 1 : -1,
    [rx, ry, rz] = rot.map((x) => sign * rad(x / 3600)),
    k = 1 + ppm * 1e-6,
    [x, y, z] = v;
  return [
    t[0] + k * (x - rz * y + ry * z),
    t[1] + k * (rz * x + y - rx * z),
    t[2] + k * (-ry * x + rx * y + z),
  ];
};
export const molodensky = (
  a: number,
  f: number,
  phi: number,
  lam: number,
  h: number,
  dx: number,
  dy: number,
  dz: number,
  da: number,
  df: number,
): Record<string, unknown> => {
  const e = ellipsoid(a, f),
    r = radii(a, f, phi);
  B.check(Math.abs(phi) < rad(89.9) && Math.abs(h) <= 1e5 && h > -0.1 * a);
  [dx, dy, dz, da].forEach((x) => magnitude(x, 10000));
  B.check(Math.abs(df) <= 0.001);
  ellipsoid(a + da, f + df);
  const s = Math.sin(phi),
    c = Math.cos(phi),
    sl = Math.sin(lam),
    cl = Math.cos(lam),
    dPhi =
      (-dx * s * cl -
        dy * s * sl +
        dz * c +
        (r.prime * e.e2 * s * c * da) / a +
        s * c * (r.meridian / (1 - f) + r.prime * (1 - f)) * df) /
      (r.meridian + h),
    dLam = (-dx * sl + dy * cl) / ((r.prime + h) * c),
    dH =
      dx * c * cl +
      dy * c * sl +
      dz * s -
      (a / r.prime) * da +
      r.prime * (1 - f) * s * s * df;
  B.check(Math.abs(phi + dPhi) < Math.PI / 2);
  return {
    latitudeDegrees: deg(phi + dPhi),
    longitudeDegrees: lonDegrees(lam + dLam),
    ellipsoidalHeightMeters: h + dH,
    latitudeShiftArcseconds: deg(dPhi) * 3600,
    longitudeShiftArcseconds: deg(dLam) * 3600,
    heightShiftMeters: dH,
  };
};
export const inverseMeridian = (
  a: number,
  f: number,
  arc: number,
  tolerance: number,
): Record<string, unknown> => {
  const quarter = meridianArc(a, f, Math.PI / 2);
  B.check(Math.abs(arc) <= quarter && tolerance > 0 && tolerance <= 1);
  let lo = -Math.PI / 2,
    hi = Math.PI / 2,
    phi = 0,
    iteration = 0;
  for (; iteration < 64; iteration++) {
    phi = (lo + hi) / 2;
    const current = meridianArc(a, f, phi);
    if (Math.abs(current - arc) <= tolerance) break;
    if (current < arc) lo = phi;
    else hi = phi;
  }
  const residual = meridianArc(a, f, phi) - arc;
  return {
    latitudeDegrees: deg(phi),
    residualMeters: residual,
    iterations: Math.min(iteration + 1, 64),
    converged: Math.abs(residual) <= tolerance,
  };
};
export const sphericalAngle = (
  phi1: number,
  lam1: number,
  phi2: number,
  lam2: number,
): number => {
  const v =
    Math.sin((phi2 - phi1) / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin((lam2 - lam1) / 2) ** 2;
  return (
    2 *
    Math.atan2(
      Math.sqrt(Math.max(0, Math.min(1, v))),
      Math.sqrt(Math.max(0, 1 - v)),
    )
  );
};
export const civilDate = (
  s: string,
): { year: number; month: number; day: number } => {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?![\s\S])/.exec(s);
  B.check(m);
  const year = B.int(Number(m![1]), 1, 9999),
    month = B.int(Number(m![2]), 1, 12),
    day = Number(m![3]),
    leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0),
    days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  B.int(day, 1, days[month - 1]);
  return { year, month, day };
};
export const jdn = (year: number, month: number, day: number): number => {
  civilDate(
    String(year).padStart(4, "0") +
      "-" +
      String(month).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0"),
  );
  const a = Math.floor((14 - month) / 12),
    y = year + 4800 - a,
    m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
};
export const julianDay = (date: string, seconds: number): number => {
  const d = civilDate(date);
  B.check(seconds >= 0 && seconds < 86400);
  return jdn(d.year, d.month, d.day) - 0.5 + seconds / 86400;
};
// IERS Bulletin C 72 (July 2026), Leap_Second.dat, expires 2027-06-28.
// This finite historical table is never extended by assuming future UTC policy.
export const leapEpochs = [
  41317, 41499, 41683, 42048, 42413, 42778, 43144, 43509, 43874, 44239, 44786,
  45151, 45516, 46247, 47161, 47892, 48257, 48804, 49169, 49534, 50083, 50630,
  51179, 53736, 54832, 56109, 57204, 57754,
] as const;
export const leapExpiryJd = jdn(2027, 6, 28) - 0.5;
export const taiMinusUtc = (jd: number): number => {
  B.check(
    jd >= 2441317.5 && jd < leapExpiryJd,
    "Pinned IERS leap table covers 1972-01-01 through 2027-06-27 only",
  );
  let index = 0;
  for (let j = 0; j < leapEpochs.length; j++)
    if (jd >= leapEpochs[j] + 2400000.5) index = j;
  return 10 + index;
};
export const knots = (
  x: readonly number[],
  y: readonly number[],
  query: number,
): { value: number; left: number; right: number; fraction: number } => {
  B.check(
    x.length >= 2 &&
      x.length === y.length &&
      x.every((v, j) => !j || v > x[j - 1]) &&
      query >= x[0] &&
      query <= x.at(-1)!,
  );
  const exact = x.indexOf(query);
  if (exact >= 0)
    return { value: y[exact], left: exact, right: exact, fraction: 0 };
  const right = x.findIndex((v) => v > query),
    left = right - 1,
    fraction = (query - x[left]) / (x[right] - x[left]);
  return {
    value: y[left] * (1 - fraction) + y[right] * fraction,
    left,
    right,
    fraction,
  };
};
export const traverse = (
  lengths: readonly number[],
  azimuths: readonly number[],
): {
  north: number[];
  east: number[];
  closureNorth: number;
  closureEast: number;
  perimeter: number;
  misclosure: number;
} => {
  B.check(lengths.length > 0 && lengths.length === azimuths.length);
  lengths.forEach((x) => B.check(x > 0 && x <= 1e6));
  azimuths.forEach((x) => B.check(x >= 0 && x < 360));
  const north = lengths.map((v, j) => v * Math.cos(rad(azimuths[j]))),
    east = lengths.map((v, j) => v * Math.sin(rad(azimuths[j]))),
    closureNorth = north.reduce((s, x) => s + x, 0),
    closureEast = east.reduce((s, x) => s + x, 0),
    perimeter = lengths.reduce((s, x) => s + x, 0);
  return {
    north,
    east,
    closureNorth,
    closureEast,
    perimeter,
    misclosure: Math.hypot(closureNorth, closureEast),
  };
};
export const adjustTraverse = (
  lengths: readonly number[],
  azimuths: readonly number[],
  transit: boolean,
): Record<string, unknown> => {
  const t = traverse(lengths, azimuths),
    sn = transit ? t.north.reduce((s, x) => s + Math.abs(x), 0) : t.perimeter,
    se = transit ? t.east.reduce((s, x) => s + Math.abs(x), 0) : t.perimeter,
    correctionsNorth = t.north.map((v, j) =>
      sn === 0
        ? 0
        : (-t.closureNorth * (transit ? Math.abs(v) : lengths[j])) / sn,
    ),
    correctionsEast = t.east.map((v, j) =>
      se === 0
        ? 0
        : (-t.closureEast * (transit ? Math.abs(v) : lengths[j])) / se,
    ),
    north = t.north.map((x, j) => x + correctionsNorth[j]),
    east = t.east.map((x, j) => x + correctionsEast[j]);
  let n = 0,
    e = 0;
  const coordinates = [
    [0, 0],
    ...north.map((x, j) => {
      n += x;
      e += east[j];
      return [e, n];
    }),
  ];
  return {
    originalClosureNorthMeters: t.closureNorth,
    originalClosureEastMeters: t.closureEast,
    correctionsNorthMeters: correctionsNorth,
    correctionsEastMeters: correctionsEast,
    northMeters: north,
    eastMeters: east,
    coordinatesEastNorthMeters: coordinates,
    residualMeters: Math.hypot(n, e),
  };
};
export const mollweide = (phi: number, lam: number, R: number): number[] => {
  let lo = -Math.PI / 2,
    hi = Math.PI / 2,
    theta = 0;
  for (let j = 0; j < 64; j++) {
    theta = (lo + hi) / 2;
    if (2 * theta + Math.sin(2 * theta) < Math.PI * Math.sin(phi)) lo = theta;
    else hi = theta;
  }
  return [
    ((2 * Math.SQRT2 * R) / Math.PI) * lam * Math.cos(theta),
    Math.SQRT2 * R * Math.sin(theta),
  ];
};
export const aeqd = (
  phi0: number,
  lam0: number,
  phi: number,
  lam: number,
  R: number,
): number[] => {
  const c = sphericalAngle(phi0, lam0, phi, lam);
  B.check(Math.PI - c > 1e-8, "Antipodal azimuth is undefined");
  if (c === 0) return [0, 0];
  const k = c / Math.sin(c),
    dl = lam - lam0;
  return [
    R * k * Math.cos(phi) * Math.sin(dl),
    R *
      k *
      (Math.cos(phi0) * Math.sin(phi) -
        Math.sin(phi0) * Math.cos(phi) * Math.cos(dl)),
  ];
};
export const finish = (
  result: Readonly<Record<string, unknown>>,
): { readonly result: Readonly<Record<string, unknown>> } => {
  let nodes = 0;
  const visit = (v: unknown, depth = 0): void => {
    B.check(depth < 20 && ++nodes <= 50000);
    if (typeof v === "number")
      B.check(Number.isFinite(v), "Finite physical output required");
    else if (Array.isArray(v)) v.forEach((x) => visit(x, depth + 1));
    else if (v && typeof v === "object")
      Object.values(v).forEach((x) => visit(x, depth + 1));
    else
      B.check(
        v === null ||
          typeof v === "boolean" ||
          (typeof v === "string" && v.length <= 8192),
      );
  };
  visit(result);
  B.check(JSON.stringify(result).length <= 1048576);
  return { result };
};
