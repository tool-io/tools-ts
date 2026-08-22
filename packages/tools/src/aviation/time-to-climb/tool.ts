import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TimeToClimbInput = {
  readonly altitudeToGainFt: number;
  readonly climbRateFpm: number;
};

export type TimeToClimbOutput = {
  readonly climbHours: number;
};

export const timeToClimbExample = {
  input: { altitudeToGainFt: 3000, climbRateFpm: 500 },
  output: { climbHours: 0.1 },
} satisfies ToolExample<TimeToClimbInput, TimeToClimbOutput>;

export const calculateTimeToClimb = (
  input: TimeToClimbInput,
): TimeToClimbOutput => {
  if (input.climbRateFpm <= 0)
    simpleError(
      "climbRateFpm",
      "The climb rate must be positive.",
      "invalid_rate",
    );
  if (input.altitudeToGainFt < 0)
    simpleError(
      "altitudeToGainFt",
      "The altitude to gain cannot be negative.",
      "invalid_altitude",
    );
  return {
    climbHours: input.altitudeToGainFt / input.climbRateFpm / 60,
  };
};

export const timeToClimbTool = createSimpleTool({
  calculate: (input) =>
    calculateTimeToClimb(input as unknown as TimeToClimbInput),
  description:
    "Compute the time needed to climb a given altitude at a sustained climb rate.",
  id: "aviation/time-to-climb",
  inputs: [
    {
      description: "Altitude to gain.",
      id: "altitudeToGainFt",
      kind: "number",
      label: "Altitude to gain",
      unit: "ft",
    },
    {
      description: "Sustained climb rate.",
      id: "climbRateFpm",
      kind: "number",
      label: "Climb rate",
      unit: "ft/min",
    },
  ],
  outputs: [
    {
      description: "Time required for the climb.",
      format: "duration-h",
      id: "climbHours",
      kind: "number",
      label: "Time to climb",
      unit: "h",
    },
  ],
  title: "Time to Climb Calculator",
});
export const runTimeToClimb = timeToClimbTool.execute;
export default timeToClimbTool;
