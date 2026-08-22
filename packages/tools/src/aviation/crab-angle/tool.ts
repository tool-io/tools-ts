import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CrabAngleInput = {
  readonly crosswindKt: number;
  readonly trueAirspeedKt: number;
};

export type CrabAngleOutput = {
  readonly crabAngleDeg: number;
};

export const crabAngleExample = {
  input: { crosswindKt: 20, trueAirspeedKt: 100 },
  output: { crabAngleDeg: 11.536959032815489 },
} satisfies ToolExample<CrabAngleInput, CrabAngleOutput>;

export const calculateCrabAngle = (input: CrabAngleInput): CrabAngleOutput => {
  if (input.trueAirspeedKt <= 0)
    simpleError(
      "trueAirspeedKt",
      "The true airspeed must be positive.",
      "invalid_speed",
    );
  const ratio = input.crosswindKt / input.trueAirspeedKt;
  if (Math.abs(ratio) > 1)
    simpleError(
      "crosswindKt",
      "The crosswind exceeds the true airspeed; no crab angle exists.",
      "wind_exceeds_airspeed",
    );
  return { crabAngleDeg: (Math.asin(ratio) * 180) / Math.PI };
};

export const crabAngleTool = createSimpleTool({
  calculate: (input) => calculateCrabAngle(input as unknown as CrabAngleInput),
  description:
    "Compute the heading offset into a direct crosswind needed to hold a course.",
  id: "aviation/crab-angle",
  inputs: [
    {
      description:
        "Crosswind component magnitude at ninety degrees to the course.",
      id: "crosswindKt",
      kind: "number",
      label: "Crosswind",
      unit: "kt",
      minimum: 0,
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
      description: "Crab angle into the wind.",
      format: "angle",
      id: "crabAngleDeg",
      kind: "number",
      label: "Crab angle",
      unit: "°",
    },
  ],
  title: "Crab Angle Calculator",
});
export const runCrabAngle = crabAngleTool.execute;
export default crabAngleTool;
