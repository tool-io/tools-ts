import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const HULL_SPEED_COEFFICIENT = 1.34;

export type HullSpeedInput = {
  readonly waterlineLengthFeet: number;
};

export type HullSpeedOutput = {
  readonly hullSpeedKt: number;
};

export const hullSpeedExample = {
  input: { waterlineLengthFeet: 25 },
  output: { hullSpeedKt: 6.7 },
} satisfies ToolExample<HullSpeedInput, HullSpeedOutput>;

export const hullSpeedTool = createSimpleTool({
  id: "nautical/hull-speed",
  title: "Hull Speed Calculator",
  description:
    "Calculate the displacement hull speed in knots from the waterline length in feet.",
  inputs: [
    {
      id: "waterlineLengthFeet",
      kind: "number",
      label: "Waterline length",
    },
  ],
  outputs: [{ id: "hullSpeedKt", kind: "number", label: "Hull speed" }],
  calculate: (input) => {
    const waterlineLengthFeet = input.waterlineLengthFeet as number;
    if (waterlineLengthFeet <= 0)
      simpleError(
        "waterlineLengthFeet",
        "Waterline length must be positive.",
        "invalid_input",
      );
    return {
      hullSpeedKt: HULL_SPEED_COEFFICIENT * Math.sqrt(waterlineLengthFeet),
    };
  },
});
export const runHullSpeed = hullSpeedTool.execute;
export default hullSpeedTool;
