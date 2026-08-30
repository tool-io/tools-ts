import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WordSpacingEmAdjustmentInput = Readonly<{
  readonly fontSizePixels: number;
  readonly wordSpacingEm: number;
}>;
export type WordSpacingEmAdjustmentOutput = Readonly<{
  readonly extraWordSpacingPixels: number;
}>;

export const calculateWordSpacingEmAdjustment = (
  x: WordSpacingEmAdjustmentInput,
): WordSpacingEmAdjustmentOutput => {
  if (!Number.isFinite(x.fontSizePixels) || x.fontSizePixels <= 0)
    simpleError("fontSizePixels", "Provide a finite positive number.");
  if (!Number.isFinite(x.wordSpacingEm))
    simpleError("wordSpacingEm", "Provide a finite number.");
  const extraWordSpacingPixels = x.fontSizePixels * x.wordSpacingEm;
  if (!Number.isFinite(extraWordSpacingPixels))
    simpleError(
      "extraWordSpacingPixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    extraWordSpacingPixels: Object.is(extraWordSpacingPixels, -0)
      ? 0
      : extraWordSpacingPixels,
  };
};

export const example = {
  input: {
    fontSizePixels: 16,
    wordSpacingEm: 0.25,
  },
  output: { extraWordSpacingPixels: 4 },
} satisfies ToolExample<
  WordSpacingEmAdjustmentInput,
  WordSpacingEmAdjustmentOutput
>;

export const tool = createSimpleTool({
  id: "typography/word-spacing-em-adjustment",
  title: "Word Spacing Em Adjustment",
  description:
    "Word-spacing addition in pixels from CSS font size and an em-valued adjustment.",
  inputs: [
    {
      id: "fontSizePixels",
      kind: "number",
      label: "Font Size Pixels",
      unit: "px",
      minimum: 0,
    },
    {
      id: "wordSpacingEm",
      kind: "number",
      label: "Word Spacing Em",
      unit: "em",
    },
  ],
  outputs: [
    {
      id: "extraWordSpacingPixels",
      kind: "number",
      label: "Extra Word Spacing Pixels",
      unit: "px",
    },
  ],
  calculate: (input) =>
    calculateWordSpacingEmAdjustment({
      fontSizePixels: input.fontSizePixels as number,
      wordSpacingEm: input.wordSpacingEm as number,
    }),
});
export const wordSpacingEmAdjustmentTool = tool;
export const runWordSpacingEmAdjustment = tool.execute;
export default tool;
