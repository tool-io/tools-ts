import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScanResolutionDpiInput = Readonly<{
  readonly scannedPixels: number;
  readonly sourceWidthInches: number;
}>;
export type ScanResolutionDpiOutput = Readonly<{
  readonly resolutionDpi: number;
}>;

export const calculateScanResolutionDpi = (
  x: ScanResolutionDpiInput,
): ScanResolutionDpiOutput => {
  if (!Number.isFinite(x.scannedPixels) || x.scannedPixels < 1)
    simpleError("scannedPixels", "Provide a finite number at least 1.");
  if (!Number.isFinite(x.sourceWidthInches) || x.sourceWidthInches < 0)
    simpleError("sourceWidthInches", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.scannedPixels))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const resolutionDpi = x.scannedPixels / x.sourceWidthInches;
  if (!Number.isFinite(resolutionDpi))
    simpleError(
      "resolutionDpi",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { resolutionDpi: Object.is(resolutionDpi, -0) ? 0 : resolutionDpi };
};

export const example = {
  input: { scannedPixels: 3000, sourceWidthInches: 10 },
  output: { resolutionDpi: 300 },
} satisfies ToolExample<ScanResolutionDpiInput, ScanResolutionDpiOutput>;

export const tool = createSimpleTool({
  id: "film/scan-resolution-dpi",
  title: "Scan Resolution DPI",
  description:
    "Effective scan resolution in pixels per inch from output pixel width and source width in inches.",
  inputs: [
    {
      id: "scannedPixels",
      kind: "integer",
      label: "Scanned Pixels",
      unit: "px",
      minimum: 1,
    },
    {
      id: "sourceWidthInches",
      kind: "number",
      label: "Source Width Inches",
      unit: "in",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "resolutionDpi",
      kind: "number",
      label: "Resolution Dpi",
      unit: "dpi",
    },
  ],
  calculate: (input) =>
    calculateScanResolutionDpi({
      scannedPixels: input.scannedPixels as number,
      sourceWidthInches: input.sourceWidthInches as number,
    }),
});
export const scanResolutionDpiTool = tool;
export const runScanResolutionDpi = tool.execute;
export default tool;
