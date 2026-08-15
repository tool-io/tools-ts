import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import { computeWindComponents } from "../wind-correction-angle/tool.js";

export type GroundSpeedInput = {
  readonly trueAirspeedKt: number;
  readonly windAngleDeg: number;
  readonly windSpeedKt: number;
};

export type GroundSpeedOutput = {
  readonly groundSpeedKt: number;
};

export const groundSpeedExample = {
  input: {
    trueAirspeedKt: 120,
    windAngleDeg: 90,
    windSpeedKt: 30,
  },
  output: { groundSpeedKt: 116.189500386 },
} satisfies ToolExample<GroundSpeedInput, GroundSpeedOutput>;

export const calculateGroundSpeed = (
  input: GroundSpeedInput,
): GroundSpeedOutput => {
  const { crosswind, headwind } = computeWindComponents(
    input.windSpeedKt as number,
    input.windAngleDeg as number,
  );
  const tas = input.trueAirspeedKt as number;
  if (Math.abs(crosswind) > tas)
    simpleError(
      "trueAirspeedKt",
      "The crosswind exceeds the true airspeed; no solution exists.",
      "wind_exceeds_airspeed",
    );
  const alongCourse = Math.sqrt(tas * tas - crosswind * crosswind);
  return {
    groundSpeedKt: roundStatistic(alongCourse - headwind),
  };
};

export const groundSpeedTool = createSimpleTool({
  calculate: (input) =>
    calculateGroundSpeed(input as unknown as GroundSpeedInput),
  description:
    "Compute ground speed from true airspeed and wind using the wind triangle.",
  id: "aviation/ground-speed",
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
      description: "Speed over the ground.",
      format: "speed",
      id: "groundSpeedKt",
      kind: "number",
      label: "Ground speed",
      unit: "kt",
    },
  ],
  title: "Ground Speed Calculator",
});
export const runGroundSpeed = groundSpeedTool.execute;
export default groundSpeedTool;
