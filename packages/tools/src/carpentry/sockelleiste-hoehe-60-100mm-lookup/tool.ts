import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SkirtingStyleClass = "grand" | "standard" | "tall";

export type SkirtingHeightLookupInput = {
  readonly styleClass: SkirtingStyleClass;
};

export type SkirtingHeightLookupOutput = {
  readonly heightMm: number;
};

const SKIRTING_HEIGHTS: Record<
  SkirtingStyleClass,
  { readonly heightMm: number }
> = {
  grand: { heightMm: 100 },
  standard: { heightMm: 60 },
  tall: { heightMm: 80 },
};

export const skirtingHeightLookupExample = {
  input: { styleClass: "tall" },
  output: { heightMm: 80 },
} satisfies ToolExample<SkirtingHeightLookupInput, SkirtingHeightLookupOutput>;

export const skirtingHeightLookupTool = createSimpleTool({
  id: "carpentry/sockelleiste-hoehe-60-100mm-lookup",
  title: "Skirting Height Lookup",
  description:
    "Look up the skirting board height for a standard, tall, or grand style class.",
  inputs: [
    {
      description: "Skirting board style class.",
      enum: ["standard", "tall", "grand"],
      id: "styleClass",
      kind: "string",
      label: "Style class",
    },
  ],
  outputs: [
    {
      description: "Skirting board height in millimeters.",
      id: "heightMm",
      kind: "number",
      label: "Height",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const styleClass = input.styleClass as SkirtingStyleClass;
    if (!(styleClass in SKIRTING_HEIGHTS))
      simpleError(
        "styleClass",
        "Unknown skirting style class.",
        "unknown_style_class",
      );
    return SKIRTING_HEIGHTS[styleClass];
  },
});
export const runSkirtingHeightLookup = skirtingHeightLookupTool.execute;
export default skirtingHeightLookupTool;
