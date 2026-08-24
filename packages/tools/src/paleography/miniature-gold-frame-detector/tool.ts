import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MiniatureGoldFrameDetectorInput = {
  readonly gildedSideCount: number;
  readonly meanGoldBorderWidthMm: number;
  readonly minimumFrameWidthMm?: number;
};

export type MiniatureGoldFrameDetectorOutput = {
  readonly frameClass:
    "no_gold_frame" | "partial_gold_border" | "full_gold_frame";
  readonly aboveWidthThreshold: boolean;
  readonly confirmedFullFrame: boolean;
};

export const calculateMiniatureGoldFrameDetector = (
  input: MiniatureGoldFrameDetectorInput,
): MiniatureGoldFrameDetectorOutput => {
  if (!(
    Number.isInteger(input.gildedSideCount) &&
    input.gildedSideCount >= 0 &&
    input.gildedSideCount <= 4
  ))
    return simpleError(
      "gildedSideCount",
      "Gilded sides must be an integer between 0 and 4.",
      "invalid_count",
    );
  if (!(
    Number.isFinite(input.meanGoldBorderWidthMm) &&
    input.meanGoldBorderWidthMm >= 0
  ))
    return simpleError(
      "meanGoldBorderWidthMm",
      "Border width must be non-negative.",
      "invalid_width",
    );
  const minimumFrameWidthMm = input.minimumFrameWidthMm ?? 2;
  if (!(Number.isFinite(minimumFrameWidthMm) && minimumFrameWidthMm > 0))
    return simpleError(
      "minimumFrameWidthMm",
      "The width threshold must be greater than zero.",
      "invalid_width",
    );
  const aboveWidthThreshold =
    input.meanGoldBorderWidthMm >= minimumFrameWidthMm;
  return {
    frameClass:
      input.gildedSideCount === 0
        ? "no_gold_frame"
        : input.gildedSideCount < 4
          ? "partial_gold_border"
          : "full_gold_frame",
    aboveWidthThreshold,
    confirmedFullFrame: input.gildedSideCount === 4 && aboveWidthThreshold,
  };
};

export const miniatureGoldFrameDetectorExample = {
  input: { gildedSideCount: 4, meanGoldBorderWidthMm: 3.5 },
  output: {
    frameClass: "full_gold_frame",
    aboveWidthThreshold: true,
    confirmedFullFrame: true,
  },
} satisfies ToolExample<
  MiniatureGoldFrameDetectorInput,
  MiniatureGoldFrameDetectorOutput
>;

export const miniatureGoldFrameDetectorTool = createSimpleTool({
  id: "paleography/miniature-gold-frame-detector",
  title: "Miniature Gold Frame Detector",
  description:
    "Detect a gold frame around a miniature under the stated rule: class from the count of gilded sides (0 none, 1-3 partial border, 4 full frame), with the frame only 'confirmed' when the mean gold border width also meets a threshold (default 2 mm).",
  inputs: [
    {
      description: "Sides of the miniature enclosed by gold (0-4).",
      id: "gildedSideCount",
      kind: "integer",
      label: "Gilded sides",
      minimum: 0,
      maximum: 4,
    },
    {
      description: "Mean width of the gold border in millimetres.",
      id: "meanGoldBorderWidthMm",
      kind: "number",
      label: "Border width",
      minimum: 0,
      unit: "mm",
    },
    {
      default: 2,
      description: "Minimum border width for a confirmed frame.",
      id: "minimumFrameWidthMm",
      kind: "number",
      label: "Width threshold",
      unit: "mm",
    },
  ],
  outputs: [
    {
      description: "Frame class from the gilded side count.",
      id: "frameClass",
      enum: ["no_gold_frame", "partial_gold_border", "full_gold_frame"],
      kind: "string",
      label: "Frame class",
    },
    {
      description: "True when the mean border width meets the threshold.",
      id: "aboveWidthThreshold",
      kind: "boolean",
      label: "Above threshold",
    },
    {
      description:
        "True for four gilded sides that also meet the width threshold.",
      id: "confirmedFullFrame",
      kind: "boolean",
      label: "Confirmed full frame",
    },
  ],
  calculate: (input) =>
    calculateMiniatureGoldFrameDetector({
      gildedSideCount: input.gildedSideCount as number,
      meanGoldBorderWidthMm: input.meanGoldBorderWidthMm as number,
      minimumFrameWidthMm: input.minimumFrameWidthMm as number,
    }),
});

export const runMiniatureGoldFrameDetector =
  miniatureGoldFrameDetectorTool.execute;
export default miniatureGoldFrameDetectorTool;
