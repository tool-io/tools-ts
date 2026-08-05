export type OklchColor = {
  readonly chroma: number;
  readonly hue: number;
  readonly lightness: number;
};

export type RgbColor = {
  readonly blue: number;
  readonly green: number;
  readonly red: number;
};

export const rgbToOklch = ({
  red,
  green,
  blue,
}: RgbColor): OklchColor | null => {
  if (
    [red, green, blue].some(
      (channel) => !Number.isFinite(channel) || channel < 0 || channel > 255,
    )
  )
    return null;
  const [r, g, b] = [red, green, blue].map((channel) => {
    const encoded = channel / 255;
    return encoded <= 0.04045
      ? encoded / 12.92
      : ((encoded + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(
    0.4122214708 * r! + 0.5363325363 * g! + 0.0514459929 * b!,
  );
  const m = Math.cbrt(
    0.2119034982 * r! + 0.6806995451 * g! + 0.1073969566 * b!,
  );
  const s = Math.cbrt(
    0.0883024619 * r! + 0.2817188376 * g! + 0.6299787005 * b!,
  );
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const labB = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const chroma = Math.hypot(a, labB);
  let hue = chroma < 1e-7 ? 0 : (Math.atan2(labB, a) * 180) / Math.PI;
  if (hue < 0) hue += 360;
  return { chroma, hue, lightness: lightness * 100 };
};

export const oklchToRgb = ({
  lightness,
  chroma,
  hue,
}: OklchColor): RgbColor | null => {
  if (
    !Number.isFinite(lightness) ||
    lightness < 0 ||
    lightness > 100 ||
    !Number.isFinite(chroma) ||
    chroma < 0 ||
    !Number.isFinite(hue) ||
    hue < 0 ||
    hue > 360
  )
    return null;
  const radians = ((hue % 360) * Math.PI) / 180;
  const a = chroma * Math.cos(radians);
  const labB = chroma * Math.sin(radians);
  const lRoot = lightness / 100 + 0.3963377774 * a + 0.2158037573 * labB;
  const mRoot = lightness / 100 - 0.1055613458 * a - 0.0638541728 * labB;
  const sRoot = lightness / 100 - 0.0894841775 * a - 1.291485548 * labB;
  const l = lRoot ** 3;
  const m = mRoot ** 3;
  const s = sRoot ** 3;
  const channels = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((channel) => {
    const encoded =
      channel <= 0.0031308
        ? 12.92 * channel
        : 1.055 * channel ** (1 / 2.4) - 0.055;
    return Math.round(Math.min(1, Math.max(0, encoded)) * 255);
  });
  return { blue: channels[2]!, green: channels[1]!, red: channels[0]! };
};
