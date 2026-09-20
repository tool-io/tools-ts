import { runHexToRgb } from "../convert/hex-to-rgb/tool.js";
import { runRelativeLuminance } from "../color/relative-luminance/tool.js";
import { runContrastRatio } from "../color/contrast-ratio/tool.js";
import { oklab, simulate } from "../color/spaces.js";
import { calculateEuclideanDistance } from "../geometry/euclidean-distance/tool.js";
import { simpleError } from "../core/simple.js";
import { calculateRandomHexColor } from "./hex-color/tool.js";
import type { GeneratorRandom } from "./generator-random.js";
export const paletteHexSchema = {
  type: "string",
  pattern: "^#[0-9A-Fa-f]{6}(?![\\s\\S])",
  minLength: 7,
  maxLength: 7,
} as const;
export const paletteColorsSchema = {
  type: "array",
  minItems: 2,
  maxItems: 32,
  items: paletteHexSchema,
} as const;
export const paletteCountSchema = {
  type: "integer",
  minimum: 2,
  maximum: 32,
} as const;
export const paletteAttemptSchema = {
  type: "integer",
  minimum: 2,
  maximum: 8192,
} as const;
export const paletteDistanceMatrixSchema = {
  type: "array",
  minItems: 2,
  maxItems: 32,
  items: {
    type: "array",
    minItems: 2,
    maxItems: 32,
    items: { type: "number", minimum: 0 },
  },
} as const;
export const paletteRgb = (hex: string): [number, number, number] => {
  const result = runHexToRgb({ hex });
  if (!result.ok)
    throw new Error(
      "Validated/generated six-digit hex was rejected by the converter.",
    );
  return [
    result.output.red / 255,
    result.output.green / 255,
    result.output.blue / 255,
  ];
};
export const paletteLuminance = (hex: string): number => {
  const [r, g, b] = paletteRgb(hex),
    result = runRelativeLuminance({
      red: Math.round(r * 255),
      green: Math.round(g * 255),
      blue: Math.round(b * 255),
    });
  if (!result.ok)
    throw new Error("Validated RGB bytes were rejected by the luminance tool.");
  return result.output.luminance;
};
export const paletteContrast = (first: string, second: string): number => {
  const result = runContrastRatio({
    luminance1: paletteLuminance(first),
    luminance2: paletteLuminance(second),
  });
  if (!result.ok)
    throw new Error("Valid luminances were rejected by the contrast tool.");
  return result.output.contrastRatio;
};
export const drawPaletteColor = (random: GeneratorRandom): string => {
  const result = calculateRandomHexColor(random.unit);
  if (result === null)
    throw new Error("Validated randomness was rejected by the hex generator.");
  return result.hex;
};
type ColorFeatures = readonly (readonly number[])[];
const features = (hex: string, dichromacy: boolean): ColorFeatures => {
  const rgb = paletteRgb(hex);
  return dichromacy
    ? (["protan", "deutan", "tritan"] as const).map((type) =>
        oklab(simulate(rgb, type).simulatedRgb),
      )
    : [oklab(rgb)];
};
const featureDistance = (a: ColorFeatures, b: ColorFeatures): number =>
  Math.min(
    ...a.map((v, i) => {
      const distance = calculateEuclideanDistance(v, b[i]);
      if (distance === null)
        throw new Error("Finite color features had no Euclidean distance.");
      return distance;
    }),
  );
export const generateSeparatedPalette = (
  count: number,
  minimum: number,
  maximumAttempts: number,
  random: GeneratorRandom,
  dichromacy: boolean,
): {
  colors: string[];
  pairDistances: number[][];
  minimumPairDistance: number;
  attempts: number;
} => {
  const colors: string[] = [],
    accepted: ColorFeatures[] = [];
  let attempts = 0;
  while (colors.length < count && attempts < maximumAttempts) {
    attempts += 1;
    const hex = drawPaletteColor(random);
    if (colors.includes(hex)) continue;
    const feature = features(hex, dichromacy);
    if (accepted.some((other) => featureDistance(feature, other) < minimum))
      continue;
    colors.push(hex);
    accepted.push(feature);
  }
  if (colors.length < count)
    return simpleError(
      "maximumAttempts",
      "Only " +
        colors.length +
        " colors met the distance policy before the attempt limit.",
      "palette_search_exhausted",
    );
  const pairDistances = accepted.map((a) =>
    accepted.map((b) => featureDistance(a, b)),
  );
  const minimumPairDistance = Math.min(
    ...pairDistances.flatMap((row, i) => row.slice(i + 1)),
  );
  return { colors, pairDistances, minimumPairDistance, attempts };
};
