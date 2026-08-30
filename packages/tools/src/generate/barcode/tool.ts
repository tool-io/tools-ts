import {
  createSimpleTool,
  simpleError,
  type ToolExample,
} from "../../core/index.js";
import {
  barcodeSymbologies,
  CodeImageError,
  decorateCodeImage,
  generateCodeImage,
  type CodeFrameStyle,
  type CodeImageOutput,
  type CodeImageRotation,
  type CodeLogoPlacement,
} from "../../code-image/index.js";

export type GenerateBarcodeInput = {
  readonly backgroundColor?: string;
  readonly borderColor?: string;
  readonly frameStyle?: CodeFrameStyle;
  readonly foregroundColor?: string;
  readonly heightMillimeters?: number;
  readonly includeText?: boolean;
  readonly logoBackgroundColor?: string;
  readonly logoDataUrl?: string;
  readonly logoPlacement?: CodeLogoPlacement;
  readonly logoScalePercent?: number;
  readonly padding?: number;
  readonly rotation?: CodeImageRotation;
  readonly scale?: number;
  readonly symbology: string;
  readonly text: string;
};

export type GenerateBarcodeOutput = CodeImageOutput;

export const generateBarcode = (
  input: GenerateBarcodeInput,
): GenerateBarcodeOutput =>
  decorateCodeImage(generateCodeImage(input), {
    borderColor: input.borderColor,
    frameStyle: input.frameStyle,
    logoBackgroundColor: input.logoBackgroundColor,
    logoDataUrl: input.logoDataUrl,
    logoPlacement: input.logoPlacement,
    logoScalePercent: input.logoScalePercent,
  });

const calculate = (
  input: Readonly<Record<string, unknown>>,
): GenerateBarcodeOutput => {
  try {
    return generateBarcode({
      backgroundColor: String(input.backgroundColor),
      borderColor: String(input.borderColor),
      frameStyle: String(input.frameStyle) as CodeFrameStyle,
      foregroundColor: String(input.foregroundColor),
      heightMillimeters: Number(input.heightMillimeters),
      includeText: Boolean(input.includeText),
      logoBackgroundColor: String(input.logoBackgroundColor),
      logoPlacement: String(input.logoPlacement) as CodeLogoPlacement,
      logoScalePercent: Number(input.logoScalePercent),
      padding: Number(input.padding),
      rotation: String(input.rotation) as CodeImageRotation,
      scale: Number(input.scale),
      symbology: String(input.symbology),
      text: String(input.text),
    });
  } catch (error) {
    if (error instanceof CodeImageError)
      simpleError(
        error.code === "encoding_failed" ? "text" : "",
        error.message,
        error.code,
      );
    throw error;
  }
};

const input = {
  backgroundColor: "#ffffff",
  borderColor: "#000000",
  frameStyle: "none" as const,
  foregroundColor: "#000000",
  heightMillimeters: 12,
  includeText: true,
  logoBackgroundColor: "#ffffff",
  logoPlacement: "left" as const,
  logoScalePercent: 24,
  padding: 4,
  rotation: "N" as const,
  scale: 3,
  symbology: "code128",
  text: "TOOL.IO-128",
};

export const barcodeExample = {
  input,
  output: generateBarcode(input),
} satisfies ToolExample<GenerateBarcodeInput, GenerateBarcodeOutput>;

export const barcodeTool = createSimpleTool({
  calculate,
  description:
    "Generate SVG for any registered linear, retail, postal, medical, stacked, or two-dimensional barcode symbology using validated text and rendering options.",
  id: "generate/barcode",
  inputs: [
    {
      default: "code128",
      description: "Barcode symbology or registered encoder ID.",
      enum: barcodeSymbologies.map(({ bcid }) => bcid),
      id: "symbology",
      kind: "string",
      label: "Barcode type",
    },
    {
      description: "Value to encode using the selected symbology.",
      id: "text",
      kind: "string",
      label: "Content",
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
      default: 12,
      description: "Requested linear-bar height in millimeters.",
      id: "heightMillimeters",
      kind: "number",
      label: "Height",
      maximum: 100,
      minimum: 1,
      unit: "mm",
    },
    {
      default: true,
      description: "Display the encoded value below supported symbols.",
      id: "includeText",
      kind: "boolean",
      label: "Human-readable text",
    },
    {
      default: "N",
      description: "Normal, right, inverted, or left orientation.",
      enum: ["N", "R", "I", "L"],
      id: "rotation",
      kind: "string",
      label: "Rotation",
    },
    {
      default: 4,
      description: "Padding around the symbol.",
      id: "padding",
      kind: "integer",
      label: "Padding",
      maximum: 20,
      minimum: 0,
    },
    {
      default: "#000000",
      description: "Six-digit hexadecimal bar or module color.",
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
      default: "none",
      description: "Optional frame around the complete exported image.",
      enum: ["none", "square", "rounded"],
      id: "frameStyle",
      kind: "string",
      label: "Frame",
    },
    {
      default: "#000000",
      description: "Six-digit hexadecimal frame color.",
      id: "borderColor",
      kind: "string",
      label: "Frame color",
    },
    {
      default: "left",
      description: "Safe placement for a logo outside the encoded symbol.",
      enum: ["left", "right", "above", "below"],
      id: "logoPlacement",
      kind: "string",
      label: "Logo placement",
    },
    {
      default: 24,
      description: "Logo size relative to the shorter side of the symbol.",
      id: "logoScalePercent",
      kind: "number",
      label: "Logo size",
      maximum: 50,
      minimum: 10,
    },
    {
      default: "#ffffff",
      description:
        'Six-digit hexadecimal color behind an external logo, or "transparent" for no backing plate.',
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
  title: "Barcode Generator",
});

export const runBarcode = barcodeTool.execute;
export default barcodeTool;
