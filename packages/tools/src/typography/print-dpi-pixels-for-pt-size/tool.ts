import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PrintDpiPixelsForPtSizeInput = Readonly<{
  readonly sizePoints: number;
  readonly dotsPerInch: number;
}>;
export type PrintDpiPixelsForPtSizeOutput = Readonly<{
  readonly pixels: number;
}>;

export const calculatePrintDpiPixelsForPtSize = (
  x: PrintDpiPixelsForPtSizeInput,
): PrintDpiPixelsForPtSizeOutput => {
  if (!Number.isFinite(x.sizePoints) || x.sizePoints < 0)
    simpleError("sizePoints", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.dotsPerInch) || x.dotsPerInch <= 0)
    simpleError("dotsPerInch", "Provide a finite positive number.");
  const pixels = (x.sizePoints * x.dotsPerInch) / 72;
  if (!Number.isFinite(pixels))
    simpleError(
      "pixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { pixels: Object.is(pixels, -0) ? 0 : pixels };
};

export const example = {
  input: {
    sizePoints: 72,
    dotsPerInch: 300,
  },
  output: { pixels: 300 },
} satisfies ToolExample<
  PrintDpiPixelsForPtSizeInput,
  PrintDpiPixelsForPtSizeOutput
>;

export const tool = createSimpleTool({
  id: "typography/print-dpi-pixels-for-pt-size",
  title: "Print Dpi Pixels For Pt Size",
  description:
    "Printed raster pixels needed for a requested point size at a given dots-per-inch resolution.",
  inputs: [
    {
      id: "sizePoints",
      kind: "number",
      label: "Size Points",
      unit: "pt",
      minimum: 0,
    },
    {
      id: "dotsPerInch",
      kind: "number",
      label: "Dots Per Inch",
      unit: "dpi",
      minimum: 0,
    },
  ],
  outputs: [{ id: "pixels", kind: "number", label: "Pixels", unit: "px" }],
  calculate: (input) =>
    calculatePrintDpiPixelsForPtSize({
      sizePoints: input.sizePoints as number,
      dotsPerInch: input.dotsPerInch as number,
    }),
});
export const printDpiPixelsForPtSizeTool = tool;
export const runPrintDpiPixelsForPtSize = tool.execute;
export default tool;
