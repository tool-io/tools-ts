import { toSVG } from "@bwip-js/generic";

import { toolResourceLimits } from "../core/limits.js";
import { findCodeSymbology, type CodeSymbology } from "./registry.js";

type EncoderOptions = Parameters<typeof toSVG>[0];
export type CodeImageRotation = "I" | "L" | "N" | "R";

export type GenerateCodeImageInput = {
  readonly backgroundColor?: string;
  readonly foregroundColor?: string;
  readonly heightMillimeters?: number;
  readonly includeText?: boolean;
  readonly padding?: number;
  readonly rotation?: CodeImageRotation;
  readonly scale?: number;
  readonly symbology: string;
  readonly text: string;
};

export type CodeImageOutput = {
  readonly bcid: string;
  readonly height: number;
  readonly svg: string;
  readonly symbology: string;
  readonly width: number;
};

export class CodeImageError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

const colorPattern = /^#[0-9a-f]{6}$/iu;
const viewBoxPattern =
  /\bviewBox="0 0 ([0-9]+(?:\.[0-9]+)?) ([0-9]+(?:\.[0-9]+)?)"/u;

const normalizedColor = (
  value: string | undefined,
  fallback: string,
): string => {
  const color = value ?? fallback;
  if (!colorPattern.test(color))
    throw new CodeImageError(
      "invalid_color",
      "Colors must use six-digit hexadecimal notation such as #000000.",
    );
  return color.slice(1).toLocaleLowerCase("en-US");
};

const finiteRange = (
  value: number | undefined,
  fallback: number,
  minimum: number,
  maximum: number,
  label: string,
): number => {
  const result = value ?? fallback;
  if (!Number.isFinite(result) || result < minimum || result > maximum)
    throw new CodeImageError(
      "invalid_render_option",
      `${label} must be between ${minimum} and ${maximum}.`,
    );
  return result;
};

const dimensionsFromSvg = (svg: string): readonly [number, number] => {
  const match = viewBoxPattern.exec(svg);
  if (!match)
    throw new CodeImageError(
      "invalid_output",
      "The encoder returned invalid SVG.",
    );
  return [Number(match[1]), Number(match[2])];
};

const render = (
  definition: CodeSymbology,
  input: GenerateCodeImageInput,
  extraOptions: Readonly<Record<string, boolean | number | string>> = {},
): CodeImageOutput => {
  if (typeof input.text !== "string" || input.text.length === 0)
    throw new CodeImageError("text_required", "Text to encode is required.");
  if (input.text.length > 10_000)
    throw new CodeImageError(
      "resource_limit_exceeded",
      "Text to encode must contain no more than 10,000 characters.",
    );
  const scale = finiteRange(input.scale, 3, 1, 10, "Scale");
  const padding = finiteRange(input.padding, 4, 0, 20, "Padding");
  const height = finiteRange(input.heightMillimeters, 12, 1, 100, "Height");
  const rotation = input.rotation ?? "N";
  if (!["I", "L", "N", "R"].includes(rotation))
    throw new CodeImageError("invalid_rotation", "Rotation is not supported.");

  try {
    const options: EncoderOptions = {
      ...definition.defaultOptions,
      ...extraOptions,
      backgroundcolor: normalizedColor(input.backgroundColor, "#ffffff"),
      barcolor: normalizedColor(input.foregroundColor, "#000000"),
      bcid: definition.bcid,
      ...(definition.family === "matrix" || definition.family === "qr"
        ? {}
        : { height }),
      includetext: input.includeText ?? false,
      padding,
      rotate: rotation,
      scale,
      text: input.text,
      textcolor: normalizedColor(input.foregroundColor, "#000000"),
    };
    const svg = toSVG(options);
    if (svg.length > toolResourceLimits.textCharacters)
      throw new CodeImageError(
        "resource_limit_exceeded",
        "The generated SVG exceeds the portable output limit.",
      );
    const [width, renderedHeight] = dimensionsFromSvg(svg);
    return {
      bcid: definition.bcid,
      height: renderedHeight,
      svg,
      symbology: definition.title,
      width,
    };
  } catch (error) {
    if (error instanceof CodeImageError) throw error;
    const message =
      typeof error === "string"
        ? error
        : error instanceof Error
          ? error.message
          : "The selected symbology cannot encode this value.";
    throw new CodeImageError("encoding_failed", message);
  }
};

export const generateCodeImage = (
  input: GenerateCodeImageInput,
  extraOptions?: Readonly<Record<string, boolean | number | string>>,
): CodeImageOutput => {
  const definition = findCodeSymbology(input.symbology);
  if (!definition)
    throw new CodeImageError(
      "unsupported_symbology",
      `Unsupported code symbology: ${input.symbology}.`,
    );
  return render(definition, input, extraOptions);
};
