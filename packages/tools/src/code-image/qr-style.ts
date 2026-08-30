import * as bwipNamespace from "@bwip-js/generic";

import { toolResourceLimits } from "../core/limits.js";
import { CodeImageError, type CodeImageOutput } from "./generate.js";

export type QrModuleStyle = "dots" | "rounded" | "square";
export type QrFinderStyle = "rounded" | "square";

export type GenerateStyledQrInput = {
  readonly backgroundColor: string;
  readonly errorCorrection: "H" | "L" | "M" | "Q";
  readonly finderColor: string;
  readonly finderStyle: QrFinderStyle;
  readonly foregroundColor: string;
  readonly logoBackgroundColor: string;
  readonly logoDataUrl?: string;
  readonly logoScalePercent: number;
  readonly moduleStyle: QrModuleStyle;
  readonly padding: number;
  readonly scale: number;
  readonly text: string;
};

type PixelMap = {
  readonly pixs: readonly number[];
  readonly pixx: number;
  readonly pixy: number;
};

const bwipJs = (
  bwipNamespace as unknown as {
    readonly default: {
      readonly raw: (options: Readonly<Record<string, unknown>>) => PixelMap[];
    };
  }
).default;

const colorPattern = /^#[0-9a-f]{6}$/iu;
const rasterDataUrlPattern =
  /^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/]+={0,2}$/iu;

const color = (value: string, label: string): string => {
  if (!colorPattern.test(value))
    throw new CodeImageError(
      "invalid_color",
      `${label} must use six-digit hexadecimal notation such as #000000.`,
    );
  return value.toLocaleLowerCase("en-US");
};

const numberInRange = (
  value: number,
  minimum: number,
  maximum: number,
  label: string,
): number => {
  if (!Number.isFinite(value) || value < minimum || value > maximum)
    throw new CodeImageError(
      "invalid_render_option",
      `${label} must be between ${minimum} and ${maximum}.`,
    );
  return value;
};

const isFinderModule = (column: number, row: number, size: number): boolean =>
  (column < 7 && row < 7) ||
  (column >= size - 7 && row < 7) ||
  (column < 7 && row >= size - 7);

const moduleElement = (
  column: number,
  row: number,
  size: number,
  padding: number,
  fill: string,
  style: QrFinderStyle | QrModuleStyle,
): string => {
  const x = padding + column * size;
  const y = padding + row * size;
  if (style === "dots") {
    const radius = size * 0.43;
    return `<circle cx="${x + size / 2}" cy="${y + size / 2}" r="${radius}" fill="${fill}"/>`;
  }
  if (style === "rounded") {
    const inset = size * 0.04;
    return `<rect x="${x + inset}" y="${y + inset}" width="${size - inset * 2}" height="${size - inset * 2}" rx="${size * 0.24}" fill="${fill}"/>`;
  }
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}"/>`;
};

const logoElements = (
  dataUrl: string | undefined,
  dimension: number,
  scalePercent: number,
  background: string,
): string => {
  if (!dataUrl) return "";
  if (dataUrl.length > 1_500_000 || !rasterDataUrlPattern.test(dataUrl))
    throw new CodeImageError(
      "invalid_logo",
      "The logo must be a PNG, JPEG, or WebP data URL no larger than 1.5 MB.",
    );
  const imageSize = dimension * (scalePercent / 100);
  const platePadding = Math.max(2, dimension * 0.0125);
  const plateSize = imageSize + platePadding * 2;
  const imageOffset = (dimension - imageSize) / 2;
  const plateOffset = (dimension - plateSize) / 2;
  const plate =
    background === "transparent"
      ? ""
      : `<rect x="${plateOffset}" y="${plateOffset}" width="${plateSize}" height="${plateSize}" rx="${platePadding}" fill="${background}"/>`;
  return `${plate}<image x="${imageOffset}" y="${imageOffset}" width="${imageSize}" height="${imageSize}" preserveAspectRatio="xMidYMid meet" href="${dataUrl}"/>`;
};

export const generateStyledQr = (
  input: GenerateStyledQrInput,
): CodeImageOutput => {
  if (!input.text)
    throw new CodeImageError("text_required", "Text to encode is required.");
  if (input.text.length > 10_000)
    throw new CodeImageError(
      "resource_limit_exceeded",
      "Text to encode must contain no more than 10,000 characters.",
    );
  if (!["dots", "rounded", "square"].includes(input.moduleStyle))
    throw new CodeImageError(
      "invalid_render_option",
      "Module style is not supported.",
    );
  if (!["rounded", "square"].includes(input.finderStyle))
    throw new CodeImageError(
      "invalid_render_option",
      "Finder style is not supported.",
    );
  const scale = numberInRange(input.scale, 1, 10, "Scale");
  const quietZone = numberInRange(input.padding, 0, 20, "Padding");
  const logoScalePercent = numberInRange(
    input.logoScalePercent,
    8,
    25,
    "Logo size",
  );
  const foreground = color(input.foregroundColor, "Foreground color");
  const finder = color(input.finderColor, "Finder color");
  const background = color(input.backgroundColor, "Background color");
  const logoBackground =
    input.logoBackgroundColor === "transparent"
      ? "transparent"
      : color(input.logoBackgroundColor, "Logo background color");

  let maps: ReturnType<typeof bwipJs.raw>;
  try {
    maps = bwipJs.raw({
      bcid: "qrcode",
      eclevel: input.errorCorrection,
      fixedeclevel: true,
      text: input.text,
    });
  } catch (error) {
    throw new CodeImageError(
      "encoding_failed",
      error instanceof Error
        ? error.message
        : "The QR Code encoder rejected this content.",
    );
  }
  const map = maps[0] as PixelMap | undefined;
  if (!map || map.pixx !== map.pixy || map.pixs.length !== map.pixx * map.pixy)
    throw new CodeImageError(
      "invalid_output",
      "The QR Code encoder returned an invalid module matrix.",
    );

  const moduleSize = 2 * scale;
  const padding = quietZone * scale;
  const dimension = map.pixx * moduleSize + padding * 2;
  const modules: string[] = [];
  for (let row = 0; row < map.pixy; row += 1) {
    for (let column = 0; column < map.pixx; column += 1) {
      if (map.pixs[row * map.pixx + column] !== 1) continue;
      const inFinder = isFinderModule(column, row, map.pixx);
      modules.push(
        moduleElement(
          column,
          row,
          moduleSize,
          padding,
          inFinder ? finder : foreground,
          inFinder ? input.finderStyle : input.moduleStyle,
        ),
      );
    }
  }
  const logo = logoElements(
    input.logoDataUrl,
    dimension,
    logoScalePercent,
    logoBackground,
  );
  const svg = `<svg viewBox="0 0 ${dimension} ${dimension}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Generated QR Code"><rect width="${dimension}" height="${dimension}" fill="${background}"/>${modules.join("")}${logo}</svg>`;
  if (svg.length > toolResourceLimits.textCharacters)
    throw new CodeImageError(
      "resource_limit_exceeded",
      "The generated SVG exceeds the portable output limit.",
    );
  return {
    bcid: "qrcode",
    height: dimension,
    svg,
    symbology: "QR Code",
    width: dimension,
  };
};
