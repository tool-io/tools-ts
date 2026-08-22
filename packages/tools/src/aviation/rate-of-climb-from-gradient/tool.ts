import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RateOfClimbFromGradientInput = {
  readonly climbGradientPercent: number;
  readonly trueAirspeed: number;
};

export type RateOfClimbFromGradientOutput = {
  readonly rateOfClimbFpm: number;
};

const FEET_PER_MINUTE_PER_KNOT = 101.26859142606666;

export const rateOfClimbFromGradientExample = {
  input: { climbGradientPercent: 3, trueAirspeed: 100 },
  output: { rateOfClimbFpm: 303.8057742782 },
} satisfies ToolExample<
  RateOfClimbFromGradientInput,
  RateOfClimbFromGradientOutput
>;

export const calculateRateOfClimbFromGradient = (
  input: RateOfClimbFromGradientInput,
): RateOfClimbFromGradientOutput => {
  if (input.climbGradientPercent <= 0 || input.climbGradientPercent > 15)
    simpleError(
      "climbGradientPercent",
      "The climb gradient must be positive and at most 15 percent.",
      "invalid_gradient",
    );
  if (input.trueAirspeed <= 0)
    simpleError(
      "trueAirspeed",
      "The true airspeed must be positive.",
      "invalid_speed",
    );
  return {
    rateOfClimbFpm:
      input.trueAirspeed *
      FEET_PER_MINUTE_PER_KNOT *
      (input.climbGradientPercent / 100),
  };
};

export const rateOfClimbFromGradientTool = createSimpleTool({
  calculate: (input) =>
    calculateRateOfClimbFromGradient(
      input as unknown as RateOfClimbFromGradientInput,
    ),
  description:
    "Compute the climb rate in feet per minute required to sustain a climb gradient at a given true airspeed.",
  id: "aviation/rate-of-climb-from-gradient",
  inputs: [
    {
      description: "Required climb gradient over the ground.",
      id: "climbGradientPercent",
      kind: "number",
      label: "Climb gradient",
      maximum: 15,
      minimum: 0,
      unit: "%",
    },
    {
      description: "True airspeed along the climb path.",
      id: "trueAirspeed",
      kind: "number",
      label: "True airspeed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Vertical speed needed to sustain the gradient.",
      format: "vertical-speed-fpm",
      id: "rateOfClimbFpm",
      kind: "number",
      label: "Rate of climb",
      unit: "ft/min",
    },
  ],
  title: "Rate of Climb from Gradient Calculator",
});
export const runRateOfClimbFromGradient = rateOfClimbFromGradientTool.execute;
export default rateOfClimbFromGradientTool;
