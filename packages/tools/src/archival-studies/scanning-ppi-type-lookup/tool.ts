import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ScanningPpiTypeLookupInput = {
  readonly originalType:
    | "text-document"
    | "manuscript"
    | "photographic-print"
    | "slide-35mm"
    | "negative-film"
    | "map-large-format"
    | "bound-volume";
};

export type ScanningPpiTypeLookupOutput = {
  readonly recommendedPpi: number;
};

const RECOMMENDED_PPI: Record<
  ScanningPpiTypeLookupInput["originalType"],
  number
> = {
  "text-document": 300,
  manuscript: 400,
  "photographic-print": 600,
  "slide-35mm": 3200,
  "negative-film": 4000,
  "map-large-format": 400,
  "bound-volume": 300,
};

export const calculateScanningPpiTypeLookup = (
  input: ScanningPpiTypeLookupInput,
): ScanningPpiTypeLookupOutput => ({
  recommendedPpi: RECOMMENDED_PPI[input.originalType],
});

export const scanningPpiTypeLookupExample = {
  input: { originalType: "negative-film" },
  output: { recommendedPpi: 4000 },
} satisfies ToolExample<
  ScanningPpiTypeLookupInput,
  ScanningPpiTypeLookupOutput
>;

export const scanningPpiTypeLookupTool = createSimpleTool({
  id: "archival-studies/scanning-ppi-type-lookup",
  title: "Scanning Resolution PPI by Original Type Lookup",
  description:
    "Return a recommended scanning resolution in pixels per inch for common archival original types; published guidance varies, so values are a heuristic lookup.",
  inputs: [
    {
      description: "Class of original material being scanned.",
      enum: [
        "text-document",
        "manuscript",
        "photographic-print",
        "slide-35mm",
        "negative-film",
        "map-large-format",
        "bound-volume",
      ],
      id: "originalType",
      kind: "string",
      label: "Original type",
    },
  ],
  outputs: [
    {
      description: "Recommended capture resolution in pixels per inch.",
      id: "recommendedPpi",
      kind: "integer",
      label: "Recommended ppi",
    },
  ],
  calculate: (input) =>
    calculateScanningPpiTypeLookup({
      originalType:
        input.originalType as ScanningPpiTypeLookupInput["originalType"],
    }),
});

export const runScanningPpiTypeLookup = scanningPpiTypeLookupTool.execute;
export default scanningPpiTypeLookupTool;
