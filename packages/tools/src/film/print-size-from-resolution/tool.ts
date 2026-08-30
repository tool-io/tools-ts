import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PrintSizeFromResolutionInput = Readonly<{
  readonly widthPixels: number;
  readonly resolutionDpi: number;
}>;
export type PrintSizeFromResolutionOutput = Readonly<{
  readonly printWidthInches: number;
}>;

export const calculatePrintSizeFromResolution = (
  x: PrintSizeFromResolutionInput,
): PrintSizeFromResolutionOutput => {
  if (!Number.isFinite(x.widthPixels) || x.widthPixels < 1)
    simpleError("widthPixels", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.resolutionDpi) || x.resolutionDpi < 0)
    simpleError("resolutionDpi", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.widthPixels))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const printWidthInches = x.widthPixels / x.resolutionDpi;
  if (!Number.isFinite(printWidthInches))
    simpleError(
      "printWidthInches",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    printWidthInches: Object.is(printWidthInches, -0) ? 0 : printWidthInches,
  };
};

export const example = {
  input: { widthPixels: 3000, resolutionDpi: 300 },
  output: { printWidthInches: 10 },
} satisfies ToolExample<
  PrintSizeFromResolutionInput,
  PrintSizeFromResolutionOutput
>;

export const tool = createSimpleTool({
  id: "film/print-size-from-resolution",
  title: "Print Size From Resolution",
  description:
    "Physical print width in inches from image pixel width and chosen print resolution in dots/pixels per inch.",
  inputs: [
    {
      id: "widthPixels",
      kind: "integer",
      label: "Width Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "resolutionDpi",
      kind: "number",
      label: "Resolution Dpi",
      unit: "dpi",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "printWidthInches",
      kind: "number",
      label: "Print Width Inches",
      unit: "in",
    },
  ],
  calculate: (input) =>
    calculatePrintSizeFromResolution({
      widthPixels: input.widthPixels as number,
      resolutionDpi: input.resolutionDpi as number,
    }),
});
export const printSizeFromResolutionTool = tool;
export const runPrintSizeFromResolution = tool.execute;
export default tool;
