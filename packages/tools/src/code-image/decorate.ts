import { toolResourceLimits } from "../core/limits.js";
import { CodeImageError, type CodeImageOutput } from "./generate.js";

export type CodeFrameStyle = "none" | "rounded" | "square";
export type CodeLogoPlacement = "above" | "below" | "left" | "right";

export type DecorateCodeImageInput = {
  readonly borderColor?: string;
  readonly frameStyle?: CodeFrameStyle;
  readonly logoBackgroundColor?: string;
  readonly logoDataUrl?: string;
  readonly logoPlacement?: CodeLogoPlacement;
  readonly logoScalePercent?: number;
};

const colorPattern = /^#[0-9a-f]{6}$/iu;
const rasterDataUrlPattern =
  /^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/]+={0,2}$/iu;

const validColor = (value: string, label: string): string => {
  if (!colorPattern.test(value))
    throw new CodeImageError(
      "invalid_color",
      `${label} must use six-digit hexadecimal notation such as #000000.`,
    );
  return value.toLocaleLowerCase("en-US");
};

export const decorateCodeImage = (
  output: CodeImageOutput,
  input: DecorateCodeImageInput,
): CodeImageOutput => {
  const frameStyle = input.frameStyle ?? "none";
  const logoDataUrl = input.logoDataUrl;
  if (!["none", "rounded", "square"].includes(frameStyle))
    throw new CodeImageError(
      "invalid_render_option",
      "Frame style is not supported.",
    );
  if (frameStyle === "none" && !logoDataUrl) return output;
  if (
    logoDataUrl &&
    (logoDataUrl.length > 1_500_000 || !rasterDataUrlPattern.test(logoDataUrl))
  )
    throw new CodeImageError(
      "invalid_logo",
      "The logo must be a PNG, JPEG, or WebP data URL no larger than 1.5 MB.",
    );

  const logoScalePercent = input.logoScalePercent ?? 24;
  if (
    !Number.isFinite(logoScalePercent) ||
    logoScalePercent < 10 ||
    logoScalePercent > 50
  )
    throw new CodeImageError(
      "invalid_render_option",
      "Logo size must be between 10 and 50.",
    );
  const placement = input.logoPlacement ?? "left";
  if (!["above", "below", "left", "right"].includes(placement))
    throw new CodeImageError(
      "invalid_render_option",
      "Logo placement is not supported.",
    );

  const openTagEnd = output.svg.indexOf(">");
  const closeTagStart = output.svg.lastIndexOf("</svg>");
  if (openTagEnd < 0 || closeTagStart <= openTagEnd)
    throw new CodeImageError(
      "invalid_output",
      "The encoder returned invalid SVG.",
    );
  const body = output.svg.slice(openTagEnd + 1, closeTagStart);
  const logoSize = logoDataUrl
    ? Math.min(output.width, output.height) * (logoScalePercent / 100)
    : 0;
  const gap = logoDataUrl
    ? Math.max(4, Math.min(output.width, output.height) * 0.05)
    : 0;
  const horizontalLogo =
    logoDataUrl && (placement === "left" || placement === "right");
  const verticalLogo =
    logoDataUrl && (placement === "above" || placement === "below");
  const width = output.width + (horizontalLogo ? logoSize + gap : 0);
  const height = output.height + (verticalLogo ? logoSize + gap : 0);
  const codeX = placement === "left" && logoDataUrl ? logoSize + gap : 0;
  const codeY = placement === "above" && logoDataUrl ? logoSize + gap : 0;
  const logoX =
    placement === "left"
      ? 0
      : placement === "right"
        ? width - logoSize
        : (width - logoSize) / 2;
  const logoY =
    placement === "above"
      ? 0
      : placement === "below"
        ? height - logoSize
        : (height - logoSize) / 2;
  const logoBackground =
    input.logoBackgroundColor === "transparent"
      ? "transparent"
      : validColor(
          input.logoBackgroundColor ?? "#ffffff",
          "Logo background color",
        );
  const frame =
    frameStyle === "none"
      ? ""
      : `<rect x="1" y="1" width="${Math.max(0, width - 2)}" height="${Math.max(0, height - 2)}" rx="${frameStyle === "rounded" ? Math.max(4, Math.min(width, height) * 0.04) : 0}" fill="none" stroke="${validColor(input.borderColor ?? "#000000", "Border color")}" stroke-width="2"/>`;
  const logoPlate =
    logoDataUrl && logoBackground !== "transparent"
      ? `<rect x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" rx="${logoSize * 0.08}" fill="${logoBackground}"/>`
      : "";
  const logo = logoDataUrl
    ? `${logoPlate}<image x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet" href="${logoDataUrl}"/>`
    : "";
  const svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Generated ${output.symbology}"><svg x="${codeX}" y="${codeY}" width="${output.width}" height="${output.height}" viewBox="0 0 ${output.width} ${output.height}">${body}</svg>${logo}${frame}</svg>`;
  if (svg.length > toolResourceLimits.textCharacters)
    throw new CodeImageError(
      "resource_limit_exceeded",
      "The decorated SVG exceeds the portable output limit.",
    );
  return { ...output, height, svg, width };
};
