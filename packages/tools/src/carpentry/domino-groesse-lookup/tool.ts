import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DominoSizeKey =
  | "4x20"
  | "5x30"
  | "6x40"
  | "8x40"
  | "8x50"
  | "8x80"
  | "10x50"
  | "10x80"
  | "10x100"
  | "12x100"
  | "12x140"
  | "14x100"
  | "14x140";

export type DominoSizeLookupInput = {
  readonly size: DominoSizeKey;
};

export type DominoSizeLookupOutput = {
  readonly tenonLengthMm: number;
  readonly tenonThicknessMm: number;
};

const DOMINO_SIZES: Record<
  DominoSizeKey,
  { readonly tenonLengthMm: number; readonly tenonThicknessMm: number }
> = {
  "4x20": { tenonLengthMm: 20, tenonThicknessMm: 4 },
  "5x30": { tenonLengthMm: 30, tenonThicknessMm: 5 },
  "6x40": { tenonLengthMm: 40, tenonThicknessMm: 6 },
  "8x40": { tenonLengthMm: 40, tenonThicknessMm: 8 },
  "8x50": { tenonLengthMm: 50, tenonThicknessMm: 8 },
  "8x80": { tenonLengthMm: 80, tenonThicknessMm: 8 },
  "10x50": { tenonLengthMm: 50, tenonThicknessMm: 10 },
  "10x80": { tenonLengthMm: 80, tenonThicknessMm: 10 },
  "10x100": { tenonLengthMm: 100, tenonThicknessMm: 10 },
  "12x100": { tenonLengthMm: 100, tenonThicknessMm: 12 },
  "12x140": { tenonLengthMm: 140, tenonThicknessMm: 12 },
  "14x100": { tenonLengthMm: 100, tenonThicknessMm: 14 },
  "14x140": { tenonLengthMm: 140, tenonThicknessMm: 14 },
};

export const dominoSizeLookupExample = {
  input: { size: "8x40" },
  output: { tenonLengthMm: 40, tenonThicknessMm: 8 },
} satisfies ToolExample<DominoSizeLookupInput, DominoSizeLookupOutput>;

export const dominoSizeLookupTool = createSimpleTool({
  id: "carpentry/domino-groesse-lookup",
  title: "Domino Size Lookup",
  description:
    "Look up the tenon thickness and length of a Festool Domino size.",
  inputs: [
    {
      description:
        "Domino size key as thickness times length, for example 8x40.",
      enum: [
        "4x20",
        "5x30",
        "6x40",
        "8x40",
        "8x50",
        "8x80",
        "10x50",
        "10x80",
        "10x100",
        "12x100",
        "12x140",
        "14x100",
        "14x140",
      ],
      id: "size",
      kind: "string",
      label: "Domino size",
    },
  ],
  outputs: [
    {
      description: "Tenon thickness in millimeters.",
      id: "tenonThicknessMm",
      kind: "number",
      label: "Tenon thickness",
      unit: "mm",
    },
    {
      description: "Tenon length in millimeters.",
      id: "tenonLengthMm",
      kind: "number",
      label: "Tenon length",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const size = input.size as DominoSizeKey;
    if (!(size in DOMINO_SIZES))
      simpleError("size", "Unknown Domino size.", "unknown_size");
    return DOMINO_SIZES[size];
  },
});
export const runDominoSizeLookup = dominoSizeLookupTool.execute;
export default dominoSizeLookupTool;
