import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LeewayTack = "port" | "starboard";

export type EstimatedPositionLeewayInput = {
  readonly leewayDegrees?: number;
  readonly tack: LeewayTack;
  readonly trueHeadingDeg: number;
};

export type EstimatedPositionLeewayOutput = {
  readonly estimatedCourseDeg: number;
};

const TACK_SIGNS: Record<LeewayTack, number> = {
  port: -1,
  starboard: 1,
};

const DEFAULT_LEEWAY_DEGREES = 5;
const MAX_LEEWAY_DEGREES = 15;

const normalizeDegrees = (value: number): number => ((value % 360) + 360) % 360;

export const calculateEstimatedPositionLeeway = (
  input: EstimatedPositionLeewayInput,
): EstimatedPositionLeewayOutput | null => {
  const leewayDegrees = input.leewayDegrees ?? DEFAULT_LEEWAY_DEGREES;
  return Number.isFinite(input.trueHeadingDeg) &&
    Number.isFinite(leewayDegrees) &&
    input.trueHeadingDeg >= 0 &&
    input.trueHeadingDeg <= 360
    ? {
        estimatedCourseDeg: normalizeDegrees(
          input.trueHeadingDeg - leewayDegrees * TACK_SIGNS[input.tack],
        ),
      }
    : null;
};

export const estimatedPositionLeewayExample = {
  input: { leewayDegrees: 5, tack: "starboard", trueHeadingDeg: 100 },
  output: { estimatedCourseDeg: 95 },
} satisfies ToolExample<
  EstimatedPositionLeewayInput,
  EstimatedPositionLeewayOutput
>;

export const estimatedPositionLeewayTool = createSimpleTool({
  id: "sailing/estimated-position-leeway",
  title: "EP With Leeway",
  description:
    "Estimate the course made good by applying leeway to the true heading, subtracting the leeway angle on the starboard tack and adding it on the port tack.",
  inputs: [
    {
      description: "Compass corrected true heading of the vessel.",
      id: "trueHeadingDeg",
      kind: "number",
      label: "True heading",
      unit: "\u00B0",
    },
    {
      description: "Tack the vessel is sailing on.",
      enum: ["port", "starboard"],
      id: "tack",
      kind: "string",
      label: "Tack",
    },
    {
      default: DEFAULT_LEEWAY_DEGREES,
      description: "Leeway drift angle between heading and track.",
      id: "leewayDegrees",
      kind: "number",
      label: "Leeway",
      maximum: MAX_LEEWAY_DEGREES,
      minimum: 0,
      unit: "\u00B0",
    },
  ],
  outputs: [
    {
      description: "Estimated course made good after leeway allowance.",
      format: "course-deg",
      id: "estimatedCourseDeg",
      kind: "number",
      label: "Estimated course",
      unit: "\u00B0",
    },
  ],
  calculate: (input) => {
    if (input.tack !== "port" && input.tack !== "starboard")
      simpleError("tack", "Choose port or starboard.", "invalid_tack");
    const estimatedCourseDeg = calculateEstimatedPositionLeeway(
      input as unknown as EstimatedPositionLeewayInput,
    );
    if (estimatedCourseDeg === null)
      simpleError(
        "trueHeadingDeg",
        "Enter a heading between 0 and 360 degrees.",
        "invalid_heading",
      );
    return estimatedCourseDeg;
  },
});

export const runEstimatedPositionLeeway = estimatedPositionLeewayTool.execute;
export default estimatedPositionLeewayTool;
