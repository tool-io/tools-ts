import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type WindCorrectionAngleInput = {
  readonly trueAirspeedKt: number;
  readonly windAngleDeg: number;
  readonly windSpeedKt: number;
};

export type WindCorrectionAngleOutput = {
  readonly wcaDeg: number;
};

export const windCorrectionAngleExample = {
  input: {
    trueAirspeedKt: 120,
    windAngleDeg: 90,
    windSpeedKt: 30,
  },
  output: { wcaDeg: 14.4775121859 },
} satisfies ToolExample<WindCorrectionAngleInput, WindCorrectionAngleOutput>;

export type WindTriangle = {
  readonly crosswind: number;
  readonly headwind: number;
};

/**
 * Shared convention for the wind tools: the wind angle is measured
 * between the wind direction and the course, where zero degrees is a
 * direct headwind and 90 degrees a pure crosswind from either side.
 */
export const computeWindComponents = (
  windSpeedKt: number,
  windAngleDeg: number,
): WindTriangle => {
  const radians = (windAngleDeg * Math.PI) / 180;
  return {
    crosswind: windSpeedKt * Math.sin(radians),
    headwind: windSpeedKt * Math.cos(radians),
  };
};

export const calculateWindCorrectionAngle = (
  input: WindCorrectionAngleInput,
): WindCorrectionAngleOutput => {
  const { crosswind } = computeWindComponents(
    input.windSpeedKt as number,
    input.windAngleDeg as number,
  );
  const ratio = crosswind / (input.trueAirspeedKt as number);
  if (Math.abs(ratio) > 1)
    simpleError(
      "trueAirspeedKt",
      "The crosswind exceeds the true airspeed; no solution exists.",
      "wind_exceeds_airspeed",
    );
  const wcaRaw = (Math.asin(ratio) * 180) / Math.PI;
  const wcaDeg =
    Math.abs(wcaRaw) < 1e-9 ? 0 : roundStatistic(wcaRaw);
  return { wcaDeg };
};

export const windCorrectionAngleTool = createSimpleTool({
  calculate: (input) =>
    calculateWindCorrectionAngle(input as unknown as WindCorrectionAngleInput),
  description:
    "Compute the wind correction angle needed to hold a course in a known wind.",
  id: "aviation/wind-correction-angle",
  inputs: [
    {
      description: "True airspeed.",
      id: "trueAirspeedKt",
      kind: "number",
      label: "TAS",
      unit: "kt",
    },
    {
      description:
        "Angle between wind and course; zero is a direct headwind, 180 a tailwind.",
      id: "windAngleDeg",
      kind: "number",
      label: "Wind angle",
      unit: "°",
    },
    {
      description: "Wind speed.",
      id: "windSpeedKt",
      kind: "number",
      label: "Wind speed",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "Crab angle to apply into the wind, positive to the right of course.",
      format: "angle",
      id: "wcaDeg",
      kind: "number",
      label: "WCA",
      unit: "°",
    },
  ],
  title: "Wind Correction Angle Calculator",
});
export const runWindCorrectionAngle = windCorrectionAngleTool.execute;
export default windCorrectionAngleTool;
