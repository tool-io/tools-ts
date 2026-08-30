import { simpleError } from "../core/simple.js";
export const channel = (v: number): number => {
  if (!Number.isFinite(v) || v < 0 || v > 1)
    return simpleError(
      "channel",
      "Finite normalized channel in [0,1] required.",
    );
  return v;
};
export const rgb = (v: readonly number[]): void => {
  if (v.length !== 3)
    return simpleError(
      "rgb",
      "Exactly three gamma-encoded normalized sRGB channels required.",
    );
  v.forEach(channel);
};
export const rgbRows = (m: readonly (readonly number[])[]): void => {
  if (!m.length || m.length > 128)
    return simpleError("colors", "1–128 RGB rows required.");
  m.forEach(rgb);
};
export const hex = (v: readonly number[]): string =>
  "#" +
  v
    .map((x) =>
      Math.round(channel(x) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase();
export const decode = (v: number): number =>
  v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
export const encode = (v: number): number =>
  v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055;
export const luminance = (v: readonly number[]): number => {
  rgb(v);
  const c = v.map(decode);
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
};
export const hue = (v: number): number => {
  if (!Number.isFinite(v) || Math.abs(v) > 1e9)
    return simpleError("hue", "Finite hue bounded to ±1e9 degrees required.");
  return ((v % 360) + 360) % 360;
};
export const hsl = (c: readonly number[]): number[] => {
  rgb(c);
  const [r, g, b] = c,
    hi = Math.max(...c),
    lo = Math.min(...c),
    d = hi - lo,
    l = (hi + lo) / 2;
  if (!d) return [0, 0, l];
  const h =
    hi === r ? (g - b) / d : hi === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [hue(h * 60), d / (1 - Math.abs(2 * l - 1)), l];
};
export const fromHsl = (h: number, s: number, l: number): number[] => {
  h = hue(h);
  channel(s);
  channel(l);
  const c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    parts =
      h < 60
        ? [c, x, 0]
        : h < 120
          ? [x, c, 0]
          : h < 180
            ? [0, c, x]
            : h < 240
              ? [0, x, c]
              : h < 300
                ? [x, 0, c]
                : [c, 0, x];
  return parts.map((v) => Math.max(0, Math.min(1, v + m)));
};
export const multiply = (
  m: readonly (readonly number[])[],
  v: readonly number[],
): number[] => m.map((row) => row.reduce((s, c, i) => s + c * v[i], 0));
export const applyMatrix = (
  c: readonly number[],
  m: readonly (readonly number[])[],
): { rgbChannels: number[]; clippedChannelIndices: number[] } => {
  rgb(c);
  const raw = multiply(m, c);
  return {
    rgbChannels: raw.map((v) => Math.max(0, Math.min(1, v))),
    clippedChannelIndices: raw.flatMap((v, i) => (v < 0 || v > 1 ? [i] : [])),
  };
};
export const oklab = (c: readonly number[]): number[] => {
  rgb(c);
  const [r, g, b] = c.map(decode),
    l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b),
    m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b),
    s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};
export const fromOklab = (v: readonly number[]): number[] => {
  const [L, a, b] = v,
    l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
};
export const oklchRgb = (L: number, C: number, h: number): number[] => {
  channel(L);
  if (!Number.isFinite(C) || C < 0 || C > 1)
    return simpleError("chroma", "Finite OKLCH chroma [0,1] required.");
  const theta = (hue(h) * Math.PI) / 180;
  return fromOklab([L, C * Math.cos(theta), C * Math.sin(theta)]);
};
export const inGamut = (v: readonly number[], tolerance = 0): boolean =>
  v.every((c) => c >= -tolerance && c <= 1 + tolerance);
export const linearP3ToSrgb = (v: readonly number[]): number[] =>
  multiply(
    [
      [1.2249401763, -0.2249401763, 0],
      [-0.0420569547, 1.0420569547, 0],
      [-0.0196375546, -0.0786360456, 1.0982736002],
    ],
    v,
  );
export const lab = (v: readonly number[]): void => {
  if (
    v.length !== 3 ||
    !Number.isFinite(v[0]) ||
    v[0] < 0 ||
    v[0] > 100 ||
    v.slice(1).some((x) => !Number.isFinite(x) || Math.abs(x) > 200)
  )
    simpleError(
      "lab",
      "Explicit same-white-reference CIELAB [L*,a*,b*] with L* [0,100], axes ±200 required.",
    );
};
export const labRows = (m: readonly (readonly number[])[]): void => {
  if (!m.length || m.length > 128)
    simpleError("lab", "1–128 caller CIELAB rows required.");
  m.forEach(lab);
};
// Full-severity matrices, Machado et al. (2009), applied in linear sRGB.
const cvd = {
  protan: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deutan: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.01182, 0.04294, 0.968881],
  ],
  tritan: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809, 0.147602],
    [0.004733, 0.691367, 0.3039],
  ],
} as const;
// Published 0.1-spaced protanomaly severity matrices, not interpolation only
// between normal vision and the dichromacy endpoint.
const protanSeverity = [
  [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  [
    [0.856167, 0.182038, -0.038205],
    [0.029342, 0.955115, 0.015544],
    [-0.00288, -0.001563, 1.004443],
  ],
  [
    [0.734766, 0.334872, -0.069637],
    [0.05184, 0.919198, 0.028963],
    [-0.004928, -0.004209, 1.009137],
  ],
  [
    [0.630323, 0.465641, -0.095964],
    [0.069181, 0.890046, 0.040773],
    [-0.006308, -0.007724, 1.014032],
  ],
  [
    [0.539009, 0.579343, -0.118352],
    [0.082546, 0.866121, 0.051332],
    [-0.007136, -0.011959, 1.019095],
  ],
  [
    [0.458064, 0.679578, -0.137642],
    [0.092785, 0.846313, 0.060902],
    [-0.007494, -0.016807, 1.024301],
  ],
  [
    [0.38545, 0.769005, -0.154455],
    [0.100526, 0.829802, 0.069673],
    [-0.007442, -0.02219, 1.029632],
  ],
  [
    [0.319627, 0.849633, -0.169261],
    [0.106241, 0.815969, 0.07779],
    [-0.007025, -0.028051, 1.035076],
  ],
  [
    [0.259411, 0.923008, -0.18242],
    [0.110296, 0.80434, 0.085364],
    [-0.006276, -0.034346, 1.040622],
  ],
  [
    [0.203876, 0.990338, -0.194214],
    [0.112975, 0.794542, 0.092483],
    [-0.005222, -0.041043, 1.046265],
  ],
  cvd.protan,
] as const;
export const simulate = (
  c: readonly number[],
  type: "protan" | "deutan" | "tritan",
  severity = 1,
): { simulatedRgb: number[]; clippedLinearChannelIndices: number[] } => {
  rgb(c);
  channel(severity);
  const original = c.map(decode);
  let raw: number[];
  if (type === "protan") {
    const scaled = severity * 10,
      lo = Math.floor(scaled),
      hi = Math.min(10, lo + 1),
      weight = scaled - lo,
      lower = multiply(protanSeverity[lo], original),
      upper = multiply(protanSeverity[hi], original);
    raw = lower.map((v, i) => v + (upper[i] - v) * weight);
  } else {
    const full = multiply(cvd[type], original);
    raw = original.map((v, i) => v + (full[i] - v) * severity);
  }
  return {
    simulatedRgb: raw.map((v) => encode(Math.max(0, Math.min(1, v)))),
    clippedLinearChannelIndices: raw.flatMap((v, i) =>
      v < 0 || v > 1 ? [i] : [],
    ),
  };
};
export const planckXY = (T: number): number[] => {
  if (!Number.isFinite(T) || T < 1667 || T > 25000)
    return simpleError(
      "temperature",
      "Planckian xy fit limited to 1667–25000 kelvin.",
    );
  const x =
      T <= 4000
        ? -0.2661239e9 / T ** 3 -
          0.234358e6 / T ** 2 +
          0.8776956e3 / T +
          0.17991
        : -3.0258469e9 / T ** 3 +
          2.1070379e6 / T ** 2 +
          0.2226347e3 / T +
          0.24039,
    y =
      T <= 2222
        ? -1.1063814 * x ** 3 - 1.3481102 * x * x + 2.18555832 * x - 0.20219683
        : T <= 4000
          ? -0.9549476 * x ** 3 -
            1.37418593 * x * x +
            2.09137015 * x -
            0.16748867
          : 3.081758 * x ** 3 - 5.8733867 * x * x + 3.75112997 * x - 0.37001483;
  return [x, y];
};
export const uv = (xy: readonly number[]): number[] => {
  if (
    xy.length !== 2 ||
    xy.some((v) => !Number.isFinite(v) || v <= 0 || v >= 1) ||
    xy[0] + xy[1] > 1
  )
    simpleError(
      "xy",
      "Physical normalized xy chromaticity required, x,y>0 and x+y≤1.",
    );
  const [x, y] = xy,
    d = -2 * x + 12 * y + 3;
  return [(4 * x) / d, (6 * y) / d];
};
export const ansiPalette = (): number[][] => {
  const base = [
      [0, 0, 0],
      [128, 0, 0],
      [0, 128, 0],
      [128, 128, 0],
      [0, 0, 128],
      [128, 0, 128],
      [0, 128, 128],
      [192, 192, 192],
      [128, 128, 128],
      [255, 0, 0],
      [0, 255, 0],
      [255, 255, 0],
      [0, 0, 255],
      [255, 0, 255],
      [0, 255, 255],
      [255, 255, 255],
    ],
    levels = [0, 95, 135, 175, 215, 255];
  for (const r of levels)
    for (const g of levels) for (const b of levels) base.push([r, g, b]);
  for (let i = 0; i < 24; i++) base.push([8 + 10 * i, 8 + 10 * i, 8 + 10 * i]);
  return base.map((r) => r.map((v) => v / 255));
};
export const quantize = (x: number, levels: number): number => {
  channel(x);
  if (!Number.isSafeInteger(levels) || levels < 2 || levels > 256)
    return simpleError("levels", "2–256 quantization levels required.");
  return Math.round(x * (levels - 1));
};
