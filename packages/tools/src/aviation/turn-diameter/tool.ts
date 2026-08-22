import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import { calculateTurnRadius } from "../turn-radius/tool.js";

export type TurnDiameterInput = {
  readonly bankAngleDeg: number;
  readonly trueAirspeedKt: number;
};

export type TurnDiameterOutput = {
  readonly diameterM: number;
};

export const turnDiameterExample = {
  input: { bankAngleDeg: 30, trueAirspeedKt: 120 },
  output: { diameterM: 1346.19710509 },
} satisfies ToolExample<TurnDiameterInput, TurnDiameterOutput>;

export const calculateTurnDiameter = (
  input: TurnDiameterInput,
): TurnDiameterOutput => {
  const radius = calculateTurnRadius({
    bankAngleDeg: input.bankAngleDeg,
    trueAirspeedKt: input.trueAirspeedKt,
  }).radiusM;
  return { diameterM: roundStatistic(radius * 2) };
};

export const turnDiameterTool = createSimpleTool({
  calculate: (input) =>
    calculateTurnDiameter(input as unknown as TurnDiameterInput),
  description:
    "Compute the full diameter of a coordinated level turn from true airspeed and bank angle.",
  id: "aviation/turn-diameter",
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
      description: "Turn diameter.",
      format: "length-m",
      id: "diameterM",
      kind: "number",
      label: "Turn diameter",
      unit: "m",
    },
  ],
  title: "Turn Diameter Calculator",
});
export const runTurnDiameter = turnDiameterTool.execute;
export default turnDiameterTool;
