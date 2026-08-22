import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimeToTopOfClimbInput = {
  readonly currentAltitudeFt: number;
  readonly rateOfClimbFpm: number;
  readonly targetAltitudeFt: number;
};

export type TimeToTopOfClimbOutput = {
  readonly climbMinutes: number;
};

export const timeToTopOfClimbExample = {
  input: {
    currentAltitudeFt: 2000,
    rateOfClimbFpm: 500,
    targetAltitudeFt: 12000,
  },
  output: { climbMinutes: 20 },
} satisfies ToolExample<TimeToTopOfClimbInput, TimeToTopOfClimbOutput>;

export const calculateTimeToTopOfClimb = (
  input: TimeToTopOfClimbInput,
): TimeToTopOfClimbOutput => {
  if (input.rateOfClimbFpm <= 0)
    simpleError(
      "rateOfClimbFpm",
      "The rate of climb must be positive.",
      "invalid_rate",
    );
  if (input.targetAltitudeFt <= input.currentAltitudeFt)
    simpleError(
      "targetAltitudeFt",
      "The target altitude must be above the current altitude.",
      "no_climb_required",
    );
  return {
    climbMinutes:
      (input.targetAltitudeFt - input.currentAltitudeFt) / input.rateOfClimbFpm,
  };
};

export const timeToTopOfClimbTool = createSimpleTool({
  calculate: (input) =>
    calculateTimeToTopOfClimb(input as unknown as TimeToTopOfClimbInput),
  description:
    "Compute the time in minutes to climb from the current altitude to a target altitude at a given rate of climb.",
  id: "aviation/time-to-top-of-climb",
  inputs: [
    {
      description: "Altitude where the climb begins.",
      id: "currentAltitudeFt",
      kind: "number",
      label: "Current altitude",
      minimum: 0,
      unit: "ft",
    },
    {
      description: "Sustained vertical speed during the climb.",
      id: "rateOfClimbFpm",
      kind: "number",
      label: "Rate of climb",
      minimum: 0,
      unit: "ft/min",
    },
    {
      description: "Altitude where the climb ends.",
      id: "targetAltitudeFt",
      kind: "number",
      label: "Target altitude",
      minimum: 0,
      unit: "ft",
    },
  ],
  outputs: [
    {
      description: "Time required for the climb.",
      format: "duration-minutes",
      id: "climbMinutes",
      kind: "number",
      label: "Climb time",
      unit: "min",
    },
  ],
  title: "Time to Top of Climb Calculator",
});
export const runTimeToTopOfClimb = timeToTopOfClimbTool.execute;
export default timeToTopOfClimbTool;
