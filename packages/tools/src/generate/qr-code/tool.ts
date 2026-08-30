import {
  createSimpleTool,
  simpleError,
  type ToolExample,
} from "../../core/index.js";
import {
  CodeImageError,
  generateCodeImage,
  generateStyledQr,
  qrCodeSymbologies,
  type CodeImageOutput,
  type QrFinderStyle,
  type QrModuleStyle,
} from "../../code-image/index.js";

export type QrCodeErrorCorrection = "H" | "L" | "M" | "Q";

export type GenerateQrCodeInput = {
  readonly backgroundColor?: string;
  readonly errorCorrection?: QrCodeErrorCorrection;
  readonly foregroundColor?: string;
  readonly finderColor?: string;
  readonly finderStyle?: QrFinderStyle;
  readonly logoBackgroundColor?: string;
  readonly logoDataUrl?: string;
  readonly logoScalePercent?: number;
  readonly moduleStyle?: QrModuleStyle;
  readonly padding?: number;
  readonly scale?: number;
  readonly symbology?: string;
  readonly text: string;
};

export type GenerateQrCodeOutput = CodeImageOutput;

export const generateQrCode = (
  input: GenerateQrCodeInput,
): GenerateQrCodeOutput => {
  const symbology = input.symbology ?? "qrcode";
  const styled =
    input.moduleStyle !== undefined ||
    input.finderStyle !== undefined ||
    input.finderColor !== undefined ||
    input.logoDataUrl !== undefined;
  if (styled && symbology !== "qrcode")
    throw new CodeImageError(
      "unsupported_style",
      "Custom modules, finder patterns, and logos are available for standard QR Codes only.",
    );
  if (styled)
    return generateStyledQr({
      backgroundColor: input.backgroundColor ?? "#ffffff",
      errorCorrection: input.errorCorrection ?? "M",
      finderColor: input.finderColor ?? input.foregroundColor ?? "#000000",
      finderStyle: input.finderStyle ?? "square",
      foregroundColor: input.foregroundColor ?? "#000000",
      logoBackgroundColor: input.logoBackgroundColor ?? "#ffffff",
      logoDataUrl: input.logoDataUrl,
      logoScalePercent: input.logoScalePercent ?? 18,
      moduleStyle: input.moduleStyle ?? "square",
      padding: input.padding ?? 8,
      scale: input.scale ?? 3,
      text: input.text,
    });
  return generateCodeImage(
    {
      backgroundColor: input.backgroundColor,
      foregroundColor: input.foregroundColor,
      padding: input.padding ?? 8,
      scale: input.scale,
      symbology: input.symbology ?? "qrcode",
      text: input.text,
    },
    {
      eclevel: input.errorCorrection ?? "M",
      fixedeclevel: true,
    },
  );
};

const calculate = (
  input: Readonly<Record<string, unknown>>,
): GenerateQrCodeOutput => {
  try {
    return generateQrCode({
      backgroundColor: String(input.backgroundColor),
      errorCorrection: String(input.errorCorrection) as QrCodeErrorCorrection,
      foregroundColor: String(input.foregroundColor),
      finderColor: String(input.finderColor),
      finderStyle: String(input.finderStyle) as QrFinderStyle,
      logoBackgroundColor: String(input.logoBackgroundColor),
      logoScalePercent: Number(input.logoScalePercent),
      moduleStyle: String(input.moduleStyle) as QrModuleStyle,
      padding: Number(input.padding),
      scale: Number(input.scale),
      symbology: String(input.symbology),
      text: String(input.text),
    });
  } catch (error) {
    if (error instanceof CodeImageError)
      simpleError(
        error.code === "encoding_failed" || error.code === "text_required"
          ? "text"
          : "",
        error.message,
        error.code,
      );
    throw error;
  }
};

const input = {
  backgroundColor: "#ffffff",
  errorCorrection: "M" as const,
  foregroundColor: "#000000",
  finderColor: "#000000",
  finderStyle: "square" as const,
  logoBackgroundColor: "#ffffff",
  logoScalePercent: 18,
  moduleStyle: "square" as const,
  padding: 8,
  scale: 3,
  symbology: "qrcode",
  text: "https://tool.io/",
};

export const qrCodeExample = {
  input,
  output: generateQrCode(input),
} satisfies ToolExample<GenerateQrCodeInput, GenerateQrCodeOutput>;

export const qrCodeTool = createSimpleTool({
  calculate,
  description:
    "Generate a standards-based QR-family symbol as portable SVG from text or a prepared application payload, with selectable error correction, scale, quiet zone, and colors.",
  id: "generate/qr-code",
  inputs: [
    {
      default: "qrcode",
      description: "QR-family symbology to generate.",
      enum: qrCodeSymbologies.map(({ bcid }) => bcid),
      id: "symbology",
      kind: "string",
      label: "QR format",
    },
    {
      description: "Text or serialized application payload to encode.",
      id: "text",
      kind: "string",
      label: "Content",
    },
    {
      default: "M",
      description: "QR error-correction level.",
      enum: ["L", "M", "Q", "H"],
      id: "errorCorrection",
      kind: "string",
      label: "Error correction",
    },
    {
      default: 3,
      description: "Integer SVG rendering scale.",
      id: "scale",
      kind: "integer",
      label: "Scale",
      maximum: 10,
      minimum: 1,
    },
    {
      default: 8,
      description: "Quiet-zone padding around the symbol.",
      id: "padding",
      kind: "integer",
      label: "Quiet zone",
      maximum: 20,
      minimum: 0,
    },
    {
      default: "square",
      description: "Shape used for data modules outside the finder patterns.",
      enum: ["square", "rounded", "dots"],
      id: "moduleStyle",
      kind: "string",
      label: "Module shape",
    },
    {
      default: "square",
      description: "Shape used for the three finder patterns.",
      enum: ["square", "rounded"],
      id: "finderStyle",
      kind: "string",
      label: "Finder shape",
    },
    {
      default: "#000000",
      description: "Six-digit hexadecimal module color.",
      id: "foregroundColor",
      kind: "string",
      label: "Foreground color",
    },
    {
      default: "#ffffff",
      description: "Six-digit hexadecimal background color.",
      id: "backgroundColor",
      kind: "string",
      label: "Background color",
    },
    {
      default: "#000000",
      description: "Six-digit hexadecimal finder-pattern color.",
      id: "finderColor",
      kind: "string",
      label: "Finder color",
    },
    {
      default: 18,
      description: "Logo width as a percentage of the finished QR Code.",
      id: "logoScalePercent",
      kind: "number",
      label: "Logo size",
      maximum: 25,
      minimum: 8,
    },
    {
      default: "#ffffff",
      description:
        'Six-digit hexadecimal color behind an embedded logo, or "transparent" for no backing plate.',
      id: "logoBackgroundColor",
      kind: "string",
      label: "Logo background",
    },
  ],
  outputs: [
    { id: "bcid", kind: "string", label: "Encoder ID" },
    { id: "symbology", kind: "string", label: "Symbology" },
    {
      format: "image/svg+xml",
      id: "svg",
      kind: "string",
      label: "SVG",
    },
    { id: "width", kind: "number", label: "Width" },
    { id: "height", kind: "number", label: "Height" },
  ],
  title: "QR Code Generator",
});

export const runQrCode = qrCodeTool.execute;
export default qrCodeTool;
