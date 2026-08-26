import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrueWindAngleInput = {
  readonly apparentWindKt: number;
  readonly apparentWindAngleDeg: number;
  readonly boatSpeedKt: number;
};

export type TrueWindAngleOutput = {
  readonly trueWindAngleDeg: number;
};

export const trueWindAngleExample = {
  input: {
    apparentWindAngleDeg: 40,
    apparentWindKt: 19,
    boatSpeedKt: 6,
  },
  output: { trueWindAngleDeg: 54.989818989 },
} satisfies ToolExample<TrueWindAngleInput, TrueWindAngleOutput>;

const normalizeDeg = (v: number): number => ((v % 360) + 360) % 360;

export const calculateTrueWindAngle = (
  input: TrueWindAngleInput,
): TrueWindAngleOutput => {
  const aws = input.apparentWindKt;
  const bs = input.boatSpeedKt;
  if (!(Number.isFinite(aws) && aws > 0))
    simpleError(
      "apparentWindKt",
      "The apparent wind speed must be positive.",
      "degenerate_triangle",
    );
  if (!(Number.isFinite(bs) && bs >= 0))
    simpleError(
      "boatSpeedKt",
      "Boat speed must be finite and non-negative.",
      "invalid_speed",
    );
  if (!(
    Number.isFinite(input.apparentWindAngleDeg) &&
    input.apparentWindAngleDeg >= 0 &&
    input.apparentWindAngleDeg <= 180
  ))
    simpleError(
      "apparentWindAngleDeg",
      "Apparent wind angle must lie between zero and 180 degrees.",
      "invalid_angle",
    );
  // Invert the wind triangle: the apparent wind vector is the true wind
  // vector minus the boat velocity, so TWA = atan2(AWS·sin AWA,
  // AWS·cos AWA − BS).
  const awaRad = (input.apparentWindAngleDeg * Math.PI) / 180;
  const twaDeg =
    (Math.atan2(aws * Math.sin(awaRad), aws * Math.cos(awaRad) - bs) * 180) /
    Math.PI;
  if (aws === bs && input.apparentWindAngleDeg === 0)
    simpleError(
      "apparentWindKt",
      "True wind angle is undefined when the inferred true-wind vector is zero.",
      "degenerate_triangle",
    );
  // Mirror port-tack and wrap-around results into [0, 180].
  const wrapped = normalizeDeg(twaDeg);
  return {
    trueWindAngleDeg: Math.round(Math.min(wrapped, 360 - wrapped) * 1e9) / 1e9,
  };
};

export const trueWindAngleTool = createSimpleTool({
  calculate: (input) =>
    calculateTrueWindAngle(input as unknown as TrueWindAngleInput),
  description:
    "Compute the true wind angle from apparent wind angle, boat speed, and apparent wind speed.",
  id: "sailing/true-wind-angle",
  inputs: [
    {
      description: "Apparent wind speed.",
      id: "apparentWindKt",
      kind: "number",
      label: "AWS",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Apparent wind angle relative to the bow.",
      id: "apparentWindAngleDeg",
      kind: "number",
      label: "AWA",
      maximum: 180,
      minimum: 0,
      unit: "°",
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
      description: "True wind angle relative to the bow.",
      format: "angle",
      id: "trueWindAngleDeg",
      kind: "number",
      label: "TWA",
      unit: "°",
    },
  ],
  title: "True Wind Angle Calculator",
});
export const runTrueWindAngle = trueWindAngleTool.execute;
export default trueWindAngleTool;
