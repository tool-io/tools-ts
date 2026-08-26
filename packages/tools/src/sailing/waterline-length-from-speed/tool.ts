import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const HULL_SPEED_COEFFICIENT = 1.34;

export type WaterlineLengthFromSpeedInput = {
  readonly speedKt: number;
};

export type WaterlineLengthFromSpeedOutput = {
  readonly waterlineLengthFeet: number;
};

export const waterlineLengthFromSpeedExample = {
  input: { speedKt: 6.7 },
  output: { waterlineLengthFeet: 25 },
} satisfies ToolExample<
  WaterlineLengthFromSpeedInput,
  WaterlineLengthFromSpeedOutput
>;

export const waterlineLengthFromSpeedTool = createSimpleTool({
  calculate: (input) => {
    const speedKt = input.speedKt as number;
    if (speedKt <= 0)
      simpleError("speedKt", "Speed must be positive.", "invalid_input");
    return {
      waterlineLengthFeet: Math.pow(speedKt / HULL_SPEED_COEFFICIENT, 2),
    };
  },
  description:
    "Estimate a hull's waterline length in feet from its hull speed using waterlineLengthFeet = (speedKt / 1.34) ^ 2.",
  id: "sailing/waterline-length-from-speed",
  inputs: [
    {
      description: "Hull speed of the vessel.",
      id: "speedKt",
      kind: "number",
      label: "Hull speed",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Estimated waterline length of the hull.",
      format: "length-ft",
      id: "waterlineLengthFeet",
      kind: "number",
      label: "Waterline length",
      unit: "ft",
    },
  ],
  title: "Waterline Length from Speed Calculator",
});
export const runWaterlineLengthFromSpeed = waterlineLengthFromSpeedTool.execute;
export default waterlineLengthFromSpeedTool;
