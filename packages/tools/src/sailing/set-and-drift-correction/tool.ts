import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SetAndDriftCorrectionInput = {
  readonly actualCourseOverGroundDeg: number;
  readonly distanceRunNm: number;
  readonly elapsedHours: number;
  readonly intendedCourseDeg: number;
  readonly speedThroughWaterKt: number;
};

export type SetAndDriftCorrectionOutput = {
  readonly driftKt: number;
  readonly setDeg: number;
};

const normalizeDeg = (v: number): number => ((v % 360) + 360) % 360;

export const setAndDriftCorrectionExample = {
  input: {
    actualCourseOverGroundDeg: 0,
    distanceRunNm: 7,
    elapsedHours: 1,
    intendedCourseDeg: 0,
    speedThroughWaterKt: 5,
  },
  output: { setDeg: 0, driftKt: 2 },
} satisfies ToolExample<
  SetAndDriftCorrectionInput,
  SetAndDriftCorrectionOutput
>;

export const calculateSetAndDrift = (
  input: SetAndDriftCorrectionInput,
): SetAndDriftCorrectionOutput => {
  if (
    !Number.isFinite(input.actualCourseOverGroundDeg) ||
    !Number.isFinite(input.distanceRunNm) ||
    !Number.isFinite(input.elapsedHours) ||
    !Number.isFinite(input.intendedCourseDeg) ||
    !Number.isFinite(input.speedThroughWaterKt)
  )
    simpleError("", "All inputs must be finite numbers.", "invalid_input");
  if (
    input.actualCourseOverGroundDeg < 0 ||
    input.actualCourseOverGroundDeg > 360 ||
    input.intendedCourseDeg < 0 ||
    input.intendedCourseDeg > 360
  )
    simpleError(
      "actualCourseOverGroundDeg",
      "Course directions must be between 0 and 360 degrees.",
      "invalid_course",
    );
  if (input.elapsedHours <= 0)
    simpleError(
      "elapsedHours",
      "The elapsed time must be positive.",
      "invalid_time",
    );
  if (input.distanceRunNm < 0)
    simpleError(
      "distanceRunNm",
      "The distance run cannot be negative.",
      "invalid_distance",
    );
  if (!(input.speedThroughWaterKt >= 0))
    simpleError(
      "speedThroughWaterKt",
      "Speed through the water must be non-negative.",
      "invalid_speed",
    );
  const toRadians = Math.PI / 180;
  const speedOverGroundKt = input.distanceRunNm / input.elapsedHours;
  const groundEast =
    speedOverGroundKt * Math.sin(input.actualCourseOverGroundDeg * toRadians);
  const groundNorth =
    speedOverGroundKt * Math.cos(input.actualCourseOverGroundDeg * toRadians);
  const waterEast =
    input.speedThroughWaterKt * Math.sin(input.intendedCourseDeg * toRadians);
  const waterNorth =
    input.speedThroughWaterKt * Math.cos(input.intendedCourseDeg * toRadians);
  const currentEast = groundEast - waterEast;
  const currentNorth = groundNorth - waterNorth;
  const driftKt = Math.hypot(currentEast, currentNorth);
  return {
    driftKt,
    setDeg:
      driftKt === 0
        ? 0
        : normalizeDeg((Math.atan2(currentEast, currentNorth) * 180) / Math.PI),
  };
};

export const setAndDriftCorrectionTool = createSimpleTool({
  calculate: (input) =>
    calculateSetAndDrift(input as unknown as SetAndDriftCorrectionInput),
  description:
    "Calculate current set and drift by subtracting the vessel's through-water velocity vector from its observed over-ground velocity vector.",
  id: "sailing/set-and-drift-correction",
  inputs: [
    {
      description: "Course actually made good over the seabed during the leg.",
      id: "actualCourseOverGroundDeg",
      kind: "number",
      label: "Actual course over ground",
      maximum: 360,
      minimum: 0,
      unit: "°",
    },
    {
      description: "Distance sailed along the actual track.",
      id: "distanceRunNm",
      kind: "number",
      label: "Distance run",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Time elapsed during the leg.",
      id: "elapsedHours",
      kind: "number",
      label: "Elapsed time",
      unit: "h",
    },
    {
      description: "Course you intended to steer.",
      id: "intendedCourseDeg",
      kind: "number",
      label: "Intended course",
      maximum: 360,
      minimum: 0,
      unit: "°",
    },
    {
      description:
        "Average speed through the water while steering the intended course.",
      id: "speedThroughWaterKt",
      kind: "number",
      label: "Speed through water",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "Direction toward which the derived current flows; zero when the current vector has zero magnitude.",
      format: "angle",
      id: "setDeg",
      kind: "number",
      label: "Set",
      unit: "°",
    },
    {
      description: "Magnitude of the derived current velocity vector.",
      format: "speed",
      id: "driftKt",
      kind: "number",
      label: "Drift",
      unit: "kt",
    },
  ],
  title: "Set and Drift Correction Calculator",
});
export const runSetAndDriftCorrection = setAndDriftCorrectionTool.execute;
export default setAndDriftCorrectionTool;
