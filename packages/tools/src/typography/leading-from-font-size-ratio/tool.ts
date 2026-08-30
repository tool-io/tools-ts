import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeadingFromFontSizeRatioInput = Readonly<{
  readonly fontSizePixels: number;
  readonly lineHeightMultiplier: number;
}>;
export type LeadingFromFontSizeRatioOutput = Readonly<{
  readonly lineHeightPixels: number;
}>;

export const calculateLeadingFromFontSizeRatio = (
  x: LeadingFromFontSizeRatioInput,
): LeadingFromFontSizeRatioOutput => {
  if (!Number.isFinite(x.fontSizePixels) || x.fontSizePixels <= 0)
    simpleError("fontSizePixels", "Provide a finite positive number.");
  if (!Number.isFinite(x.lineHeightMultiplier) || x.lineHeightMultiplier <= 0)
    simpleError("lineHeightMultiplier", "Provide a finite positive number.");
  const lineHeightPixels = x.fontSizePixels * x.lineHeightMultiplier;
  if (!Number.isFinite(lineHeightPixels))
    simpleError(
      "lineHeightPixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    lineHeightPixels: Object.is(lineHeightPixels, -0) ? 0 : lineHeightPixels,
  };
};

export const example = {
  input: {
    fontSizePixels: 16,
    lineHeightMultiplier: 1.5,
  },
  output: { lineHeightPixels: 24 },
} satisfies ToolExample<
  LeadingFromFontSizeRatioInput,
  LeadingFromFontSizeRatioOutput
>;

export const tool = createSimpleTool({
  id: "typography/leading-from-font-size-ratio",
  title: "Leading From Font Size Ratio",
  description:
    "Line-height in CSS pixels from font size and a unitless leading multiplier.",
  inputs: [
    {
      id: "fontSizePixels",
      kind: "number",
      label: "Font Size Pixels",
      unit: "px",
      minimum: 0,
    },
    {
      id: "lineHeightMultiplier",
      kind: "number",
      label: "Line Height Multiplier",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "lineHeightPixels",
      kind: "number",
      label: "Line Height Pixels",
      unit: "px",
    },
  ],
  calculate: (input) =>
    calculateLeadingFromFontSizeRatio({
      fontSizePixels: input.fontSizePixels as number,
      lineHeightMultiplier: input.lineHeightMultiplier as number,
    }),
});
export const leadingFromFontSizeRatioTool = tool;
export const runLeadingFromFontSizeRatio = tool.execute;
export default tool;
