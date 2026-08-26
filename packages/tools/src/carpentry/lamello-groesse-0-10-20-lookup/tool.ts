import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BiscuitSize = "0" | "10" | "20";

export type BiscuitSizeLookupInput = {
  readonly size: BiscuitSize;
};

export type BiscuitSizeLookupOutput = {
  readonly heightMm: number;
  readonly thicknessMm: number;
  readonly widthMm: number;
};

const BISCUIT_WIDTH_MM: Record<BiscuitSize, number> = {
  "0": 47,
  "10": 53,
  "20": 56,
};

const BISCUIT_HEIGHT_MM: Record<BiscuitSize, number> = {
  "0": 15,
  "10": 22,
  "20": 23,
};

const BISCUIT_THICKNESS_MM = 4;

export const biscuitSizeLookupExample = {
  input: { size: "20" },
  output: { heightMm: 23, thicknessMm: 4, widthMm: 56 },
} satisfies ToolExample<BiscuitSizeLookupInput, BiscuitSizeLookupOutput>;

export const biscuitSizeLookupTool = createSimpleTool({
  id: "carpentry/lamello-groesse-0-10-20-lookup",
  title: "Biscuit Size Lookup",
  description:
    "Look up the width, height, and thickness of a standard biscuit size.",
  inputs: [
    {
      description: "Biscuit size: 0, 10, or 20.",
      enum: ["0", "10", "20"],
      id: "size",
      kind: "string",
      label: "Biscuit size",
    },
  ],
  outputs: [
    {
      description: "Biscuit width in millimeters.",
      id: "widthMm",
      kind: "number",
      label: "Width",
      unit: "mm",
    },
    {
      description: "Biscuit height in millimeters.",
      id: "heightMm",
      kind: "number",
      label: "Height",
      unit: "mm",
    },
    {
      description: "Biscuit thickness in millimeters.",
      id: "thicknessMm",
      kind: "number",
      label: "Thickness",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const size = input.size as BiscuitSize;
    if (!(size in BISCUIT_WIDTH_MM))
      simpleError("size", "Unknown biscuit size.", "unknown_size");
    return {
      heightMm: BISCUIT_HEIGHT_MM[size],
      thicknessMm: BISCUIT_THICKNESS_MM,
      widthMm: BISCUIT_WIDTH_MM[size],
    };
  },
});
export const runBiscuitSizeLookup = biscuitSizeLookupTool.execute;
export default biscuitSizeLookupTool;
