import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DescentAngleInput = {
  readonly altitudeToLoseFt: number;
  readonly distanceNm: number;
};

export type DescentAngleOutput = {
  readonly descentAngleDeg: number;
};

/** Nautical mile in feet. */
const FT_PER_NM = 6076.115485564;

export const descentAngleExample = {
  input: { altitudeToLoseFt: 3184, distanceNm: 10 },
  output: { descentAngleDeg: 2.999664101487109 },
} satisfies ToolExample<DescentAngleInput, DescentAngleOutput>;

export const calculateDescentAngle = (
  input: DescentAngleInput,
): DescentAngleOutput => {
  if (input.distanceNm <= 0)
    simpleError(
      "distanceNm",
      "The distance must be positive.",
      "invalid_distance",
    );
  if (input.altitudeToLoseFt < 0)
    simpleError(
      "altitudeToLoseFt",
      "The altitude to lose cannot be negative.",
      "invalid_altitude",
    );
  const distanceFt = input.distanceNm * FT_PER_NM;
  return {
    descentAngleDeg:
      (Math.atan(input.altitudeToLoseFt / distanceFt) * 180) / Math.PI,
  };
};

export const descentAngleTool = createSimpleTool({
  calculate: (input) =>
    calculateDescentAngle(input as unknown as DescentAngleInput),
  description:
    "Compute the flight path angle of a descent from the altitude lost over a given distance.",
  id: "aviation/descent-angle",
  inputs: [
    {
      description: "Altitude lost during the descent.",
      id: "altitudeToLoseFt",
      kind: "number",
      label: "Altitude to lose",
      unit: "ft",
    },
    {
      description: "Horizontal distance covered during the descent.",
      id: "distanceNm",
      kind: "number",
      label: "Distance",
      unit: "nm",
    },
  ],
  outputs: [
    {
      description: "Descent flight path angle.",
      format: "angle",
      id: "descentAngleDeg",
      kind: "number",
      label: "Descent angle",
      unit: "°",
    },
  ],
  title: "Descent Angle Calculator",
});
export const runDescentAngle = descentAngleTool.execute;
export default descentAngleTool;
