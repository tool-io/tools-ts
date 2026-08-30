import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RasterPixelsPrintSizeCalculatorInput = Readonly<{
  readonly widthPixels: number;
  readonly dotsPerInch: number;
}>;
export type RasterPixelsPrintSizeCalculatorOutput = Readonly<{
  readonly printWidthCentimeters: number;
}>;

export const calculateRasterPixelsPrintSizeCalculator = (
  x: RasterPixelsPrintSizeCalculatorInput,
): RasterPixelsPrintSizeCalculatorOutput => {
  if (
    !Number.isFinite(x.widthPixels) ||
    !Number.isSafeInteger(x.widthPixels) ||
    x.widthPixels < 1
  )
    simpleError("widthPixels", "Provide a positive safe integer.");
  if (!Number.isFinite(x.dotsPerInch) || x.dotsPerInch <= 0)
    simpleError("dotsPerInch", "Provide a finite positive number.");
  const printWidthCentimeters = (x.widthPixels * 2.54) / x.dotsPerInch;
  if (!Number.isFinite(printWidthCentimeters))
    simpleError(
      "printWidthCentimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    printWidthCentimeters: Object.is(printWidthCentimeters, -0)
      ? 0
      : printWidthCentimeters,
  };
};

export const example = {
  input: {
    widthPixels: 3000,
    dotsPerInch: 300,
  },
  output: { printWidthCentimeters: 25.4 },
} satisfies ToolExample<
  RasterPixelsPrintSizeCalculatorInput,
  RasterPixelsPrintSizeCalculatorOutput
>;

export const tool = createSimpleTool({
  id: "cartography/raster-pixels-print-size-calculator",
  title: "Raster Pixels Print Size Calculator",
  description:
    "Printed width in centimetres from horizontal pixel count and print resolution in dots per inch.",
  inputs: [
    {
      id: "widthPixels",
      kind: "integer",
      label: "Width Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "dotsPerInch",
      kind: "number",
      label: "Dots Per Inch",
      unit: "dpi",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "printWidthCentimeters",
      kind: "number",
      label: "Print Width Centimeters",
      unit: "cm",
    },
  ],
  calculate: (input) =>
    calculateRasterPixelsPrintSizeCalculator({
      widthPixels: input.widthPixels as number,
      dotsPerInch: input.dotsPerInch as number,
    }),
});
export const rasterPixelsPrintSizeCalculatorTool = tool;
export const runRasterPixelsPrintSizeCalculator = tool.execute;
export default tool;
