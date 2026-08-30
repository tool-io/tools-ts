import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParagraphSpacingVsLeadingRatioInput = Readonly<{
  readonly paragraphGapPixels: number;
  readonly lineHeightPixels: number;
}>;
export type ParagraphSpacingVsLeadingRatioOutput = Readonly<{
  readonly spacingToLeadingRatio: number;
}>;

export const calculateParagraphSpacingVsLeadingRatio = (
  x: ParagraphSpacingVsLeadingRatioInput,
): ParagraphSpacingVsLeadingRatioOutput => {
  if (!Number.isFinite(x.paragraphGapPixels) || x.paragraphGapPixels < 0)
    simpleError("paragraphGapPixels", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.lineHeightPixels) || x.lineHeightPixels <= 0)
    simpleError("lineHeightPixels", "Provide a finite positive number.");
  const spacingToLeadingRatio = x.paragraphGapPixels / x.lineHeightPixels;
  if (!Number.isFinite(spacingToLeadingRatio))
    simpleError(
      "spacingToLeadingRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    spacingToLeadingRatio: Object.is(spacingToLeadingRatio, -0)
      ? 0
      : spacingToLeadingRatio,
  };
};

export const example = {
  input: {
    paragraphGapPixels: 24,
    lineHeightPixels: 24,
  },
  output: { spacingToLeadingRatio: 1 },
} satisfies ToolExample<
  ParagraphSpacingVsLeadingRatioInput,
  ParagraphSpacingVsLeadingRatioOutput
>;

export const tool = createSimpleTool({
  id: "typography/paragraph-spacing-vs-leading-ratio",
  title: "Paragraph Spacing Vs Leading Ratio",
  description: "Paragraph gap expressed as a multiple of line-height.",
  inputs: [
    {
      id: "paragraphGapPixels",
      kind: "number",
      label: "Paragraph Gap Pixels",
      unit: "px",
      minimum: 0,
    },
    {
      id: "lineHeightPixels",
      kind: "number",
      label: "Line Height Pixels",
      unit: "px",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "spacingToLeadingRatio",
      kind: "number",
      label: "Spacing To Leading Ratio",
    },
  ],
  calculate: (input) =>
    calculateParagraphSpacingVsLeadingRatio({
      paragraphGapPixels: input.paragraphGapPixels as number,
      lineHeightPixels: input.lineHeightPixels as number,
    }),
});
export const paragraphSpacingVsLeadingRatioTool = tool;
export const runParagraphSpacingVsLeadingRatio = tool.execute;
export default tool;
