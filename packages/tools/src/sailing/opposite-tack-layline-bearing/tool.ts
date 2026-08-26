import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LaylineSide = "left" | "right";

export type OppositeTackLaylineBearingInput = {
  readonly closeHauledAngleDeg?: number;
  readonly laylineSide: LaylineSide;
  readonly trueWindFromDeg: number;
};

export type OppositeTackLaylineBearingOutput = {
  readonly oppositeLaylineBearingDeg: number;
};

const DEFAULT_CLOSE_HAULED_ANGLE_DEG = 45;
const MIN_CLOSE_HAULED_ANGLE_DEG = 20;
const MAX_CLOSE_HAULED_ANGLE_DEG = 89;

const SIDE_SIGNS: Record<LaylineSide, number> = {
  left: -1,
  right: 1,
};

const normalizeDegrees = (value: number): number => ((value % 360) + 360) % 360;

export const calculateOppositeTackLaylineBearing = (
  input: OppositeTackLaylineBearingInput,
): OppositeTackLaylineBearingOutput | null => {
  const closeHauledAngleDeg =
    input.closeHauledAngleDeg ?? DEFAULT_CLOSE_HAULED_ANGLE_DEG;
  return Number.isFinite(input.trueWindFromDeg) &&
    Number.isFinite(closeHauledAngleDeg) &&
    closeHauledAngleDeg >= MIN_CLOSE_HAULED_ANGLE_DEG &&
    closeHauledAngleDeg <= MAX_CLOSE_HAULED_ANGLE_DEG &&
    input.trueWindFromDeg >= 0 &&
    input.trueWindFromDeg <= 360
    ? {
        oppositeLaylineBearingDeg: normalizeDegrees(
          input.trueWindFromDeg +
            closeHauledAngleDeg * SIDE_SIGNS[input.laylineSide],
        ),
      }
    : null;
};

export const oppositeTackLaylineBearingExample = {
  input: {
    closeHauledAngleDeg: 45,
    laylineSide: "right",
    trueWindFromDeg: 0,
  },
  output: { oppositeLaylineBearingDeg: 45 },
} satisfies ToolExample<
  OppositeTackLaylineBearingInput,
  OppositeTackLaylineBearingOutput
>;

export const oppositeTackLaylineBearingTool = createSimpleTool({
  id: "sailing/opposite-tack-layline-bearing",
  title: "Opposite Tack Layline Bearing",
  description:
    "Calculate the bearing of the opposite tack layline by offsetting the true wind direction by the tacking angle to the chosen side of the wind.",
  inputs: [
    {
      description: "Direction the true wind blows from.",
      id: "trueWindFromDeg",
      kind: "number",
      label: "True wind from",
      unit: "\u00B0",
    },
    {
      description: "Side of the wind for the opposite tack layline.",
      enum: ["left", "right"],
      id: "laylineSide",
      kind: "string",
      label: "Layline side",
    },
    {
      default: DEFAULT_CLOSE_HAULED_ANGLE_DEG,
      description:
        "Angle between the boat's close-hauled course and the true-wind direction; the full tacking angle is twice this value.",
      id: "closeHauledAngleDeg",
      kind: "number",
      label: "Close-hauled angle",
      maximum: MAX_CLOSE_HAULED_ANGLE_DEG,
      minimum: MIN_CLOSE_HAULED_ANGLE_DEG,
      unit: "\u00B0",
    },
  ],
  outputs: [
    {
      description: "Bearing of the opposite tack layline.",
      format: "course-deg",
      id: "oppositeLaylineBearingDeg",
      kind: "number",
      label: "Opposite layline bearing",
      unit: "\u00B0",
    },
  ],
  calculate: (input) => {
    if (input.laylineSide !== "left" && input.laylineSide !== "right")
      simpleError("laylineSide", "Choose left or right.", "invalid_side");
    const oppositeLaylineBearingDeg = calculateOppositeTackLaylineBearing(
      input as unknown as OppositeTackLaylineBearingInput,
    );
    if (oppositeLaylineBearingDeg === null)
      simpleError(
        "trueWindFromDeg",
        "Enter a wind direction between 0 and 360 degrees.",
        "invalid_wind",
      );
    return oppositeLaylineBearingDeg;
  },
});

export const runOppositeTackLaylineBearing =
  oppositeTackLaylineBearingTool.execute;
export default oppositeTackLaylineBearingTool;
