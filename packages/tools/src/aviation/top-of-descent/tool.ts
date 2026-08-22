import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TopOfDescentInput = {
  readonly currentAltitudeFt: number;
  readonly descentRateFpm: number;
  readonly groundSpeedKt: number;
  readonly targetAltitudeFt: number;
};

export type TopOfDescentOutput = {
  readonly distanceNm: number;
};

export const topOfDescentExample = {
  input: {
    currentAltitudeFt: 10000,
    descentRateFpm: 500,
    groundSpeedKt: 120,
    targetAltitudeFt: 0,
  },
  output: { distanceNm: 40 },
} satisfies ToolExample<TopOfDescentInput, TopOfDescentOutput>;

export const calculateTopOfDescent = (
  input: TopOfDescentInput,
): TopOfDescentOutput => {
  const altitudeToLose = input.currentAltitudeFt - input.targetAltitudeFt;
  if (altitudeToLose <= 0)
    simpleError(
      "targetAltitudeFt",
      "The target must be below the current altitude.",
      "invalid_altitudes",
    );
  if (input.descentRateFpm <= 0)
    simpleError(
      "descentRateFpm",
      "The descent rate must be positive.",
      "invalid_rate",
    );
  if (input.groundSpeedKt <= 0)
    simpleError(
      "groundSpeedKt",
      "The ground speed must be positive.",
      "invalid_speed",
    );
  const minutes = altitudeToLose / input.descentRateFpm;
  return { distanceNm: (input.groundSpeedKt * minutes) / 60 };
};

export const topOfDescentTool = createSimpleTool({
  calculate: (input) =>
    calculateTopOfDescent(input as unknown as TopOfDescentInput),
  description:
    "Compute the distance before the target where a descent must begin for a given rate and ground speed.",
  id: "aviation/top-of-descent",
  inputs: [
    {
      description: "Current cruise altitude.",
      id: "currentAltitudeFt",
      kind: "number",
      label: "Current altitude",
      unit: "ft",
    },
    {
      description: "Target altitude at the point of arrival.",
      id: "targetAltitudeFt",
      kind: "number",
      label: "Target altitude",
      unit: "ft",
    },
    {
      description: "Planned vertical speed during the descent.",
      id: "descentRateFpm",
      kind: "number",
      label: "Descent rate",
      unit: "ft/min",
    },
    {
      description: "Ground speed during the descent.",
      id: "groundSpeedKt",
      kind: "number",
      label: "Ground speed",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "Distance before the target at which the descent should start.",
      format: "length-nm",
      id: "distanceNm",
      kind: "number",
      label: "Top of descent",
      unit: "nm",
    },
  ],
  title: "Top of Descent Calculator",
});
export const runTopOfDescent = topOfDescentTool.execute;
export default topOfDescentTool;
