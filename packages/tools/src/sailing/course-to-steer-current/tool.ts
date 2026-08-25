import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CourseToSteerCurrentInput = {
  readonly desiredTrackDeg: number;
  readonly currentSetDeg: number;
  readonly currentDriftKt: number;
  readonly boatSpeedKt: number;
};

export type CourseToSteerCurrentOutput = {
  readonly courseToSteerDeg: number;
};

export const courseToSteerCurrentExample = {
  input: {
    boatSpeedKt: 6,
    currentDriftKt: 2,
    currentSetDeg: 90,
    desiredTrackDeg: 0,
  },
} satisfies ToolExample<CourseToSteerCurrentInput, CourseToSteerCurrentOutput>;

export const calculateCourseToSteer = (
  input: CourseToSteerCurrentInput,
): CourseToSteerCurrentOutput => {
  if (input.boatSpeedKt <= 0)
    simpleError(
      "boatSpeedKt",
      "The boat speed must be positive.",
      "invalid_speed",
    );
  if (input.currentDriftKt < 0)
    simpleError(
      "currentDriftKt",
      "The current drift cannot be negative.",
      "invalid_drift",
    );
  const trackRad = (input.desiredTrackDeg * Math.PI) / 180;
  const setRad = (input.currentSetDeg * Math.PI) / 180;
  const crossDrift = input.currentDriftKt * Math.sin(setRad - trackRad);
  const ratio = crossDrift / input.boatSpeedKt;
  if (Math.abs(ratio) > 1)
    simpleError(
      "currentDriftKt",
      "The current is too strong for the boat speed to hold the desired track.",
      "current_exceeds_boat_speed",
    );
  const wcaRad = Math.asin(ratio);
  return {
    courseToSteerDeg:
      (input.desiredTrackDeg - (wcaRad * 180) / Math.PI + 360) % 360,
  };
};

export const courseToSteerCurrentTool = createSimpleTool({
  calculate: (input) =>
    calculateCourseToSteer(input as unknown as CourseToSteerCurrentInput),
  description:
    "Compute the heading to steer that compensates for a known tidal stream to achieve a desired track.",
  id: "sailing/course-to-steer-current",
  inputs: [
    {
      description: "Desired track over ground.",
      id: "desiredTrackDeg",
      kind: "number",
      label: "Desired track",
      maximum: 360,
      minimum: 0,
      unit: "°",
    },
    {
      description: "Direction toward which the current flows.",
      id: "currentSetDeg",
      kind: "number",
      label: "Current set",
      maximum: 360,
      minimum: 0,
      unit: "°",
    },
    {
      description: "Speed of the tidal stream.",
      id: "currentDriftKt",
      kind: "number",
      label: "Drift",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Boat speed through the water.",
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Heading to steer to compensate for current.",
      format: "angle",
      id: "courseToSteerDeg",
      kind: "number",
      label: "CTS",
      unit: "°",
    },
  ],
  title: "Course to Steer With Current Calculator",
});
export const runCourseToSteerCurrent = courseToSteerCurrentTool.execute;
export default courseToSteerCurrentTool;
