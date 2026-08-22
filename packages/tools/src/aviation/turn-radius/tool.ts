import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TurnRadiusInput = {
  readonly bankAngleDeg: number;
  readonly trueAirspeedKt: number;
};

export type TurnRadiusOutput = {
  readonly radiusM: number;
};

const GRAVITY_M_PER_S2 = 9.80665;
const KT_TO_M_PER_S = 0.514444;

export const turnRadiusExample = {
  input: { bankAngleDeg: 30, trueAirspeedKt: 120 },
  output: { radiusM: 673.098552543 },
} satisfies ToolExample<TurnRadiusInput, TurnRadiusOutput>;

export const calculateTurnRadius = (
  input: TurnRadiusInput,
): TurnRadiusOutput => {
  const radians = (input.bankAngleDeg * Math.PI) / 180;
  const tangent = Math.tan(radians);
  if (tangent <= 1e-12)
    simpleError(
      "bankAngleDeg",
      "The turn radius is undefined without bank.",
      "undefined_turn_radius",
    );
  const speedMPerS = input.trueAirspeedKt * KT_TO_M_PER_S;
  return {
    radiusM: roundStatistic(
      (speedMPerS * speedMPerS) / (GRAVITY_M_PER_S2 * tangent),
    ),
  };
};

export const turnRadiusTool = createSimpleTool({
  calculate: (input) =>
    calculateTurnRadius(input as unknown as TurnRadiusInput),
  description:
    "Compute the radius of a coordinated level turn from true airspeed and bank angle.",
  id: "aviation/turn-radius",
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
      description: "Turn radius.",
      format: "length-m",
      id: "radiusM",
      kind: "number",
      label: "Turn radius",
      unit: "m",
    },
  ],
  title: "Turn Radius Calculator",
});
export const runTurnRadius = turnRadiusTool.execute;
export default turnRadiusTool;
