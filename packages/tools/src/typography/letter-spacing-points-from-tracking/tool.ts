import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LetterSpacingPointsFromTrackingInput = Readonly<{
  readonly fontSizePoints: number;
  readonly trackingThousandthsOfEm: number;
}>;
export type LetterSpacingPointsFromTrackingOutput = Readonly<{
  readonly letterSpacingPoints: number;
}>;

export const calculateLetterSpacingPointsFromTracking = (
  x: LetterSpacingPointsFromTrackingInput,
): LetterSpacingPointsFromTrackingOutput => {
  if (!Number.isFinite(x.fontSizePoints) || x.fontSizePoints <= 0)
    simpleError("fontSizePoints", "Provide a finite positive number.");
  if (!Number.isFinite(x.trackingThousandthsOfEm))
    simpleError("trackingThousandthsOfEm", "Provide a finite number.");
  const letterSpacingPoints =
    (x.fontSizePoints * x.trackingThousandthsOfEm) / 1000;
  if (!Number.isFinite(letterSpacingPoints))
    simpleError(
      "letterSpacingPoints",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    letterSpacingPoints: Object.is(letterSpacingPoints, -0)
      ? 0
      : letterSpacingPoints,
  };
};

export const example = {
  input: {
    fontSizePoints: 12,
    trackingThousandthsOfEm: 50,
  },
  output: { letterSpacingPoints: 0.6 },
} satisfies ToolExample<
  LetterSpacingPointsFromTrackingInput,
  LetterSpacingPointsFromTrackingOutput
>;

export const tool = createSimpleTool({
  id: "typography/letter-spacing-points-from-tracking",
  title: "Letter Spacing Points From Tracking",
  description:
    "Letter spacing in points from tracking in thousandths of an em and font size in points.",
  inputs: [
    {
      id: "fontSizePoints",
      kind: "number",
      label: "Font Size Points",
      unit: "pt",
      minimum: 0,
    },
    {
      id: "trackingThousandthsOfEm",
      kind: "number",
      label: "Tracking Thousandths Of Em",
    },
  ],
  outputs: [
    {
      id: "letterSpacingPoints",
      kind: "number",
      label: "Letter Spacing Points",
      unit: "pt",
    },
  ],
  calculate: (input) =>
    calculateLetterSpacingPointsFromTracking({
      fontSizePoints: input.fontSizePoints as number,
      trackingThousandthsOfEm: input.trackingThousandthsOfEm as number,
    }),
});
export const letterSpacingPointsFromTrackingTool = tool;
export const runLetterSpacingPointsFromTracking = tool.execute;
export default tool;
