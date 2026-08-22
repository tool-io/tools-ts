import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GroundspeedFromWindTriangleInput = {
  readonly trueAirspeedKt: number;
  readonly trueCourseDeg: number;
  readonly windSpeedKt: number;
  readonly windFromDeg: number;
};

export type GroundspeedFromWindTriangleOutput = {
  readonly groundSpeedKt: number;
};

const normalizeDegrees = (value: number): number => ((value % 360) + 360) % 360;

export const groundspeedFromWindTriangleExample = {
  input: {
    trueAirspeedKt: 120,
    trueCourseDeg: 90,
    windSpeedKt: 20,
    windFromDeg: 90,
  },
  output: { groundSpeedKt: 100 },
} satisfies ToolExample<
  GroundspeedFromWindTriangleInput,
  GroundspeedFromWindTriangleOutput
>;

export const calculateGroundspeedFromWindTriangle = (
  input: GroundspeedFromWindTriangleInput,
): GroundspeedFromWindTriangleOutput => {
  if (input.trueAirspeedKt <= 0)
    simpleError(
      "trueAirspeedKt",
      "The true airspeed must be greater than zero.",
      "invalid_true_airspeed",
    );
  const relativeAngleDeg = normalizeDegrees(
    input.windFromDeg - input.trueCourseDeg,
  );
  return {
    groundSpeedKt: Math.sqrt(
      input.trueAirspeedKt ** 2 +
        input.windSpeedKt ** 2 -
        2 *
          input.trueAirspeedKt *
          input.windSpeedKt *
          Math.cos((relativeAngleDeg * Math.PI) / 180),
    ),
  };
};

export const groundspeedFromWindTriangleTool = createSimpleTool({
  calculate: (input) =>
    calculateGroundspeedFromWindTriangle(
      input as unknown as GroundspeedFromWindTriangleInput,
    ),
  description:
    "Solve the wind triangle for ground speed from true airspeed, course, and wind.",
  id: "aviation/groundspeed-from-wind-triangle",
  inputs: [
    {
      description: "True airspeed through the airmass.",
      id: "trueAirspeedKt",
      kind: "number",
      label: "True airspeed",
      minimum: 0,
      unit: "kt",
    },
    {
      description:
        "Intended track over the ground; any angle, normalized internally.",
      id: "trueCourseDeg",
      kind: "number",
      label: "True course",
      unit: "°",
    },
    {
      description: "Sustained wind speed.",
      id: "windSpeedKt",
      kind: "number",
      label: "Wind speed",
      minimum: 0,
      unit: "kt",
    },
    {
      description:
        "Direction the wind comes from in degrees true; any angle, normalized internally.",
      id: "windFromDeg",
      kind: "number",
      label: "Wind from",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Resulting ground speed along the course.",
      format: "speed",
      id: "groundSpeedKt",
      kind: "number",
      label: "Ground speed",
      unit: "kt",
    },
  ],
  title: "Groundspeed from Wind Triangle Calculator",
});
export const runGroundspeedFromWindTriangle =
  groundspeedFromWindTriangleTool.execute;
export default groundspeedFromWindTriangleTool;
