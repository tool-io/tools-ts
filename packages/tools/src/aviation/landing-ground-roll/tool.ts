import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type LandingGroundRollInput = {
  readonly decelerationG: number;
  readonly touchdownSpeedKt: number;
};

export type LandingGroundRollOutput = {
  readonly groundRollM: number;
};

const GRAVITY_M_PER_S2 = 9.80665;
const KT_TO_M_PER_S = 0.514444;

export const landingGroundRollExample = {
  input: { decelerationG: 0.25, touchdownSpeedKt: 50 },
  output: { groundRollM: 134.935288369 },
} satisfies ToolExample<LandingGroundRollInput, LandingGroundRollOutput>;

export const calculateLandingGroundRoll = (
  input: LandingGroundRollInput,
): LandingGroundRollOutput => {
  if (input.decelerationG <= 0 || input.decelerationG > 2)
    simpleError(
      "decelerationG",
      "The deceleration must be between zero and two g.",
      "invalid_deceleration",
    );
  const speedMPerS = input.touchdownSpeedKt * KT_TO_M_PER_S;
  const deceleration = input.decelerationG * GRAVITY_M_PER_S2;
  return {
    groundRollM: roundStatistic((speedMPerS * speedMPerS) / (2 * deceleration)),
  };
};

export const landingGroundRollTool = createSimpleTool({
  calculate: (input) =>
    calculateLandingGroundRoll(input as unknown as LandingGroundRollInput),
  description:
    "Compute the landing ground roll from the touchdown speed and average braking deceleration using constant-deceleration kinematics.",
  id: "aviation/landing-ground-roll",
  inputs: [
    {
      description: "Speed at touchdown.",
      id: "touchdownSpeedKt",
      kind: "number",
      label: "Touchdown speed",
      unit: "kt",
    },
    {
      description: "Average braking deceleration during the roll, in g.",
      id: "decelerationG",
      kind: "number",
      label: "Deceleration",
      unit: "g",
    },
  ],
  outputs: [
    {
      description: "Runway distance used for the roll.",
      format: "length-m",
      id: "groundRollM",
      kind: "number",
      label: "Ground roll",
      unit: "m",
    },
  ],
  title: "Landing Ground Roll Calculator",
});
export const runLandingGroundRoll = landingGroundRollTool.execute;
export default landingGroundRollTool;
