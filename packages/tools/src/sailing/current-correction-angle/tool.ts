import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CurrentCorrectionAngleInput = {
  readonly boatSpeedKt: number;
  readonly currentSpeedKt: number;
  readonly relativeAngleDeg: number;
};

export type CurrentCorrectionAngleOutput = {
  readonly correctionDeg: number;
};

export const currentCorrectionAngleExample = {
  input: {
    boatSpeedKt: 10,
    currentSpeedKt: 5,
    relativeAngleDeg: 90,
  },
  output: { correctionDeg: -30.000000000000004 },
} satisfies ToolExample<
  CurrentCorrectionAngleInput,
  CurrentCorrectionAngleOutput
>;

const DEGREES_PER_RADIAN = 180 / Math.PI;
const RADIANS_PER_DEGREE = Math.PI / 180;

const crabAngleDeg = (
  boatSpeedKt: number,
  currentSpeedKt: number,
  relativeAngleDeg: number,
): number =>
  -Math.asin(
    (currentSpeedKt * Math.sin(relativeAngleDeg * RADIANS_PER_DEGREE)) /
      boatSpeedKt,
  ) * DEGREES_PER_RADIAN;

export const currentCorrectionAngleTool = createSimpleTool({
  id: "sailing/current-correction-angle",
  title: "Current Correction Angle Calculator",
  description:
    "Compute the signed crab angle needed to oppose a current's cross-track component. Routes whose cross-current exceeds boat speed cannot be held.",
  inputs: [
    {
      description: "Boat speed through the water.",
      id: "boatSpeedKt",
      kind: "number",
      label: "Boat speed",
      minimum: 0,
      unit: "kt",
    },
    {
      description: "Current speed across the course.",
      id: "currentSpeedKt",
      kind: "number",
      label: "Current speed",
      minimum: 0,
      unit: "kt",
    },
    {
      description:
        "Angle between the desired course and the current set, zero meaning the current opposes nothing.",
      id: "relativeAngleDeg",
      kind: "number",
      label: "Relative angle",
      maximum: 360,
      minimum: 0,
      unit: "\u00B0",
    },
  ],
  outputs: [
    {
      description:
        "Signed heading correction opposite the current's cross-course component.",
      format: "angle",
      id: "correctionDeg",
      kind: "number",
      label: "Correction angle",
      unit: "\u00B0",
    },
  ],
  calculate: (input) => {
    const boatSpeedKt = input.boatSpeedKt as number;
    if (boatSpeedKt <= 0)
      simpleError(
        "boatSpeedKt",
        "Boat speed must be positive.",
        "invalid_speed",
      );
    const crossCurrentKt =
      (input.currentSpeedKt as number) *
      Math.sin((input.relativeAngleDeg as number) * RADIANS_PER_DEGREE);
    if (Math.abs(crossCurrentKt) > boatSpeedKt)
      simpleError(
        "currentSpeedKt",
        "The cross-current exceeds boat speed, so the requested track cannot be held.",
        "current_exceeds_boat_speed",
      );
    const correctionDeg = crabAngleDeg(
      boatSpeedKt,
      input.currentSpeedKt as number,
      input.relativeAngleDeg as number,
    );
    return { correctionDeg: Object.is(correctionDeg, -0) ? 0 : correctionDeg };
  },
});
export const runCurrentCorrectionAngle = currentCorrectionAngleTool.execute;
export default currentCorrectionAngleTool;
