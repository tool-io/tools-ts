import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type RateOfTurnInput = {
  readonly bankAngleDeg: number;
  readonly trueAirspeedKt: number;
};

export type RateOfTurnOutput = {
  readonly rateDegPerS: number;
};

const GRAVITY_M_PER_S2 = 9.80665;
const KT_TO_M_PER_S = 0.514444;
const RAD_TO_DEG = 180 / Math.PI;

export const rateOfTurnExample = {
  input: { bankAngleDeg: 30, trueAirspeedKt: 120 },
  output: { rateDegPerS: 5.25488635526 },
} satisfies ToolExample<RateOfTurnInput, RateOfTurnOutput>;

export const calculateRateOfTurn = (
  input: RateOfTurnInput,
): RateOfTurnOutput => {
  if (input.bankAngleDeg <= 0 || input.bankAngleDeg >= 90)
    simpleError(
      "bankAngleDeg",
      "The bank angle must be between zero and ninety degrees.",
      "invalid_bank_angle",
    );
  const radians = (input.bankAngleDeg * Math.PI) / 180;
  const speedMPerS = input.trueAirspeedKt * KT_TO_M_PER_S;
  const rateRadPerS = (GRAVITY_M_PER_S2 * Math.tan(radians)) / speedMPerS;
  return { rateDegPerS: roundStatistic(rateRadPerS * RAD_TO_DEG) };
};

export const rateOfTurnTool = createSimpleTool({
  calculate: (input) =>
    calculateRateOfTurn(input as unknown as RateOfTurnInput),
  description:
    "Compute the rate of turn in degrees per second from true airspeed and bank angle.",
  id: "aviation/rate-of-turn",
  inputs: [
    {
      description: "True airspeed.",
      id: "trueAirspeedKt",
      kind: "number",
      label: "TAS",
      unit: "kt",
    },
    {
      description: "Bank angle of the turn.",
      id: "bankAngleDeg",
      kind: "number",
      label: "Bank angle",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Turn rate.",
      format: "angular-rate",
      id: "rateDegPerS",
      kind: "number",
      label: "Rate of turn",
      unit: "°/s",
    },
  ],
  title: "Rate of Turn Calculator",
});
export const runRateOfTurn = rateOfTurnTool.execute;
export default rateOfTurnTool;
