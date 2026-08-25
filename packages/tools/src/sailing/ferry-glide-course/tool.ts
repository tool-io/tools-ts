import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CurrentSide = "from-port" | "from-starboard";

export type FerryGlideCourseInput = {
  readonly boatSpeedKt: number;
  readonly currentKt: number;
  readonly currentSide: CurrentSide;
  readonly desiredCourseDeg: number;
};

export type FerryGlideCourseOutput = {
  readonly ferryGlideCourseDeg: number;
};

const SIDE_SIGNS: Record<CurrentSide, number> = {
  "from-port": -1,
  "from-starboard": 1,
};

const normalizeDegrees = (value: number): number => ((value % 360) + 360) % 360;

export const calculateFerryGlideCourse = (
  input: FerryGlideCourseInput,
): FerryGlideCourseOutput | null => {
  if (
    !Number.isFinite(input.desiredCourseDeg) ||
    input.desiredCourseDeg < 0 ||
    input.desiredCourseDeg > 360 ||
    !Number.isFinite(input.boatSpeedKt) ||
    !Number.isFinite(input.currentKt) ||
    input.boatSpeedKt <= 0 ||
    input.currentKt < 0 ||
    input.currentKt >= input.boatSpeedKt
  )
    return null;
  const correctionDeg =
    Math.asin(Math.min(1, input.currentKt / input.boatSpeedKt)) *
    (180 / Math.PI);
  return {
    ferryGlideCourseDeg: normalizeDegrees(
      input.desiredCourseDeg + correctionDeg * SIDE_SIGNS[input.currentSide],
    ),
  };
};

export const ferryGlideCourseExample = {
  input: {
    boatSpeedKt: 4,
    currentKt: 2,
    currentSide: "from-starboard",
    desiredCourseDeg: 90,
  },
  output: { ferryGlideCourseDeg: 120 },
} satisfies ToolExample<FerryGlideCourseInput, FerryGlideCourseOutput>;

export const ferryGlideCourseTool = createSimpleTool({
  id: "sailing/ferry-glide-course",
  title: "Ferry Glide Course",
  description:
    "Calculate the heading to steer so cross current lets the boat ferry glide onto the desired course, correcting by the arcsine of the current to boat speed ratio signed by the side the current comes from.",
  inputs: [
    {
      description: "Track over ground wanted once across.",
      id: "desiredCourseDeg",
      kind: "number",
      label: "Desired course",
      unit: "\u00B0",
    },
    {
      description: "Boat speed through the water.",
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      unit: "kt",
    },
    {
      description: "Current strength acting on the crossing.",
      id: "currentKt",
      kind: "number",
      label: "Current",
      unit: "kt",
    },
    {
      description:
        "Side the current flows from relative to the desired course.",
      enum: ["from-port", "from-starboard"],
      id: "currentSide",
      kind: "string",
      label: "Current side",
    },
  ],
  outputs: [
    {
      description: "Heading through the water that ferries onto the course.",
      format: "course-deg",
      id: "ferryGlideCourseDeg",
      kind: "number",
      label: "Ferry glide course",
      unit: "\u00B0",
    },
  ],
  calculate: (input) => {
    if (
      input.currentSide !== "from-port" &&
      input.currentSide !== "from-starboard"
    )
      simpleError(
        "currentSide",
        "Choose from-port or from-starboard.",
        "invalid_side",
      );
    const ferryGlideCourseDeg = calculateFerryGlideCourse(
      input as unknown as FerryGlideCourseInput,
    );
    if (ferryGlideCourseDeg === null)
      simpleError(
        "boatSpeedKt",
        "The crossing is not ferryable: boat speed must be positive and current must be non-negative and slower than the boat.",
        "not_ferryable",
      );
    return ferryGlideCourseDeg;
  },
});

export const runFerryGlideCourse = ferryGlideCourseTool.execute;
export default ferryGlideCourseTool;
