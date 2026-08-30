import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrackingEmLetterSpacingInput = Readonly<{
  readonly fontSizePixels: number;
  readonly trackingEm: number;
}>;
export type TrackingEmLetterSpacingOutput = Readonly<{
  readonly letterSpacingPixels: number;
}>;

export const calculateTrackingEmLetterSpacing = (
  x: TrackingEmLetterSpacingInput,
): TrackingEmLetterSpacingOutput => {
  if (!Number.isFinite(x.fontSizePixels) || x.fontSizePixels <= 0)
    simpleError("fontSizePixels", "Provide a finite positive number.");
  if (!Number.isFinite(x.trackingEm))
    simpleError("trackingEm", "Provide a finite number.");
  const letterSpacingPixels = x.fontSizePixels * x.trackingEm;
  if (!Number.isFinite(letterSpacingPixels))
    simpleError(
      "letterSpacingPixels",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    letterSpacingPixels: Object.is(letterSpacingPixels, -0)
      ? 0
      : letterSpacingPixels,
  };
};

export const example = {
  input: {
    fontSizePixels: 16,
    trackingEm: 0.05,
  },
  output: { letterSpacingPixels: 0.8 },
} satisfies ToolExample<
  TrackingEmLetterSpacingInput,
  TrackingEmLetterSpacingOutput
>;

export const tool = createSimpleTool({
  id: "typography/tracking-em-letter-spacing",
  title: "Tracking Em Letter Spacing",
  description:
    "CSS letter spacing in pixels from font size and tracking expressed in em units.",
  inputs: [
    {
      id: "fontSizePixels",
      kind: "number",
      label: "Font Size Pixels",
      unit: "px",
      minimum: 0,
    },
    { id: "trackingEm", kind: "number", label: "Tracking Em", unit: "em" },
  ],
  outputs: [
    {
      id: "letterSpacingPixels",
      kind: "number",
      label: "Letter Spacing Pixels",
      unit: "px",
    },
  ],
  calculate: (input) =>
    calculateTrackingEmLetterSpacing({
      fontSizePixels: input.fontSizePixels as number,
      trackingEm: input.trackingEm as number,
    }),
});
export const trackingEmLetterSpacingTool = tool;
export const runTrackingEmLetterSpacing = tool.execute;
export default tool;
