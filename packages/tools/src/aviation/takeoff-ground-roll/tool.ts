import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TakeoffGroundRollInput = {
  readonly accelerationG: number;
  readonly liftoffSpeedKt: number;
};

export type TakeoffGroundRollOutput = {
  readonly groundRollM: number;
};

const GRAVITY_M_PER_S2 = 9.80665;
const KT_TO_M_PER_S = 0.514444;

export const takeoffGroundRollExample = {
  input: { accelerationG: 0.17, liftoffSpeedKt: 55 },
  output: { groundRollM: 240.105439597 },
} satisfies ToolExample<TakeoffGroundRollInput, TakeoffGroundRollOutput>;

export const calculateTakeoffGroundRoll = (
  input: TakeoffGroundRollInput,
): TakeoffGroundRollOutput => {
  if (input.accelerationG <= 0 || input.accelerationG > 2)
    simpleError(
      "accelerationG",
      "The acceleration must be between zero and two g.",
      "invalid_acceleration",
    );
  const speedMPerS = input.liftoffSpeedKt * KT_TO_M_PER_S;
  const acceleration = input.accelerationG * GRAVITY_M_PER_S2;
  return {
    groundRollM: roundStatistic((speedMPerS * speedMPerS) / (2 * acceleration)),
  };
};

export const takeoffGroundRollTool = createSimpleTool({
  calculate: (input) =>
    calculateTakeoffGroundRoll(input as unknown as TakeoffGroundRollInput),
  description:
    "Compute the takeoff ground roll from the liftoff speed and average forward acceleration using constant-acceleration kinematics.",
  id: "aviation/takeoff-ground-roll",
  inputs: [
    {
      description: "Speed at which the wheels leave the runway.",
      id: "liftoffSpeedKt",
      kind: "number",
      label: "Liftoff speed",
      unit: "kt",
    },
    {
      description: "Average forward acceleration during the roll, in g.",
      id: "accelerationG",
      kind: "number",
      label: "Acceleration",
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
  title: "Takeoff Ground Roll Calculator",
});
export const runTakeoffGroundRoll = takeoffGroundRollTool.execute;
export default takeoffGroundRollTool;
