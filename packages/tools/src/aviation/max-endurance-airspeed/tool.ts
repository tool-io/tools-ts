import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MaxEnduranceAirspeedInput = {
  readonly minimumSinkSpeedKt: number;
};

export type MaxEnduranceAirspeedOutput = {
  readonly maxEnduranceSpeedKt: number;
};

export const maxEnduranceAirspeedExample = {
  input: { minimumSinkSpeedKt: 30 },
  output: { maxEnduranceSpeedKt: 30 },
} satisfies ToolExample<MaxEnduranceAirspeedInput, MaxEnduranceAirspeedOutput>;

export const calculateMaxEnduranceAirspeed = (
  input: MaxEnduranceAirspeedInput,
): MaxEnduranceAirspeedOutput => {
  if (input.minimumSinkSpeedKt <= 0)
    simpleError(
      "minimumSinkSpeedKt",
      "The minimum sink speed must be positive.",
      "invalid_speed",
    );
  return { maxEnduranceSpeedKt: input.minimumSinkSpeedKt };
};

export const maxEnduranceAirspeedTool = createSimpleTool({
  calculate: (input) =>
    calculateMaxEnduranceAirspeed(
      input as unknown as MaxEnduranceAirspeedInput,
    ),
  description:
    "Estimate the maximum-endurance airspeed of a glider, which equals the minimum-sink speed.",
  id: "aviation/max-endurance-airspeed",
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
      description: "Airspeed for maximum endurance.",
      format: "speed",
      id: "maxEnduranceSpeedKt",
      kind: "number",
      label: "Max endurance speed",
      unit: "kt",
    },
  ],
  title: "Max Endurance Airspeed Calculator",
});
export const runMaxEnduranceAirspeed = maxEnduranceAirspeedTool.execute;
export default maxEnduranceAirspeedTool;
