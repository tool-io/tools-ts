import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MaxRangeAirspeedInput = {
  readonly minimumSinkSpeedKt: number;
};

export type MaxRangeAirspeedOutput = {
  readonly maxRangeSpeedKt: number;
};

const BEST_GLIDE_TO_MIN_SINK_RATIO = Math.sqrt(3);

export const maxRangeAirspeedExample = {
  input: { minimumSinkSpeedKt: 30 },
  output: { maxRangeSpeedKt: 51.96152422706631 },
} satisfies ToolExample<MaxRangeAirspeedInput, MaxRangeAirspeedOutput>;

export const calculateMaxRangeAirspeed = (
  input: MaxRangeAirspeedInput,
): MaxRangeAirspeedOutput => {
  if (input.minimumSinkSpeedKt <= 0)
    simpleError(
      "minimumSinkSpeedKt",
      "The minimum sink speed must be positive.",
      "invalid_speed",
    );
  return {
    maxRangeSpeedKt: BEST_GLIDE_TO_MIN_SINK_RATIO * input.minimumSinkSpeedKt,
  };
};

export const maxRangeAirspeedTool = createSimpleTool({
  calculate: (input) =>
    calculateMaxRangeAirspeed(input as unknown as MaxRangeAirspeedInput),
  description:
    "Estimate the best glide airspeed for maximum range as the square root of three times the minimum-sink speed.",
  id: "aviation/max-range-airspeed",
  inputs: [
    {
      description: "Minimum-sink airspeed of the glider.",
      id: "minimumSinkSpeedKt",
      kind: "number",
      label: "Minimum sink speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Best glide airspeed for maximum range.",
      format: "speed",
      id: "maxRangeSpeedKt",
      kind: "number",
      label: "Max range speed",
      unit: "kt",
    },
  ],
  title: "Max Range Airspeed Calculator",
});
export const runMaxRangeAirspeed = maxRangeAirspeedTool.execute;
export default maxRangeAirspeedTool;
