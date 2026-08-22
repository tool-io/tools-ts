import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type BankAngleStandardRateInput = {
  readonly standardRateDegPerS: number;
  readonly trueAirspeedKt: number;
};

export type BankAngleStandardRateOutput = {
  readonly bankAngleDeg: number;
};

const GRAVITY_M_PER_S2 = 9.80665;
const KT_TO_M_PER_S = 0.514444;
const DEG_TO_RAD = Math.PI / 180;

export const bankAngleStandardRateExample = {
  input: { standardRateDegPerS: 3, trueAirspeedKt: 120 },
  output: { bankAngleDeg: 18.2426158738 },
} satisfies ToolExample<
  BankAngleStandardRateInput,
  BankAngleStandardRateOutput
>;

export const calculateBankAngleForStandardRate = (
  input: BankAngleStandardRateInput,
): BankAngleStandardRateOutput => {
  const rate = input.standardRateDegPerS;
  if (rate <= 0 || rate > 360)
    simpleError(
      "standardRateDegPerS",
      "The turn rate must be between zero and 360 degrees per second.",
      "invalid_rate",
    );
  const speedMPerS = input.trueAirspeedKt * KT_TO_M_PER_S;
  const tangent = (speedMPerS * rate * DEG_TO_RAD) / GRAVITY_M_PER_S2;
  return {
    bankAngleDeg: roundStatistic(Math.atan(tangent) / DEG_TO_RAD),
  };
};

export const bankAngleStandardRateTool = createSimpleTool({
  calculate: (input) =>
    calculateBankAngleForStandardRate(
      input as unknown as BankAngleStandardRateInput,
    ),
  description:
    "Compute the bank angle that produces a desired turn rate at a given true airspeed.",
  id: "aviation/bank-angle-standard-rate",
  inputs: [
    {
      description:
        "Desired turn rate; three degrees per second is the standard rate.",
      id: "standardRateDegPerS",
      kind: "number",
      label: "Turn rate",
      unit: "°/s",
    },
    {
      description: "True airspeed.",
      id: "trueAirspeedKt",
      kind: "number",
      label: "TAS",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Required bank angle.",
      format: "angle",
      id: "bankAngleDeg",
      kind: "number",
      label: "Bank angle",
      unit: "°",
    },
  ],
  title: "Bank Angle for Standard Rate Calculator",
});
export const runBankAngleForStandardRate = bankAngleStandardRateTool.execute;
export default bankAngleStandardRateTool;
