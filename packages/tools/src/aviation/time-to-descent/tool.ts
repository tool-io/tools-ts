import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimeToDescentInput = {
  readonly altitudeToLoseFt: number;
  readonly descentRateFpm: number;
};

export type TimeToDescentOutput = {
  readonly minutes: number;
};

export const timeToDescentExample = {
  input: { altitudeToLoseFt: 10000, descentRateFpm: 500 },
  output: { minutes: 20 },
} satisfies ToolExample<TimeToDescentInput, TimeToDescentOutput>;

export const calculateTimeToDescent = (
  input: TimeToDescentInput,
): TimeToDescentOutput => {
  if (input.descentRateFpm <= 0)
    simpleError(
      "descentRateFpm",
      "The descent rate must be positive.",
      "invalid_rate",
    );
  if (input.altitudeToLoseFt < 0)
    simpleError(
      "altitudeToLoseFt",
      "The altitude to lose cannot be negative.",
      "invalid_altitude",
    );
  return { minutes: input.altitudeToLoseFt / input.descentRateFpm };
};

export const timeToDescentTool = createSimpleTool({
  calculate: (input) =>
    calculateTimeToDescent(input as unknown as TimeToDescentInput),
  description:
    "Compute the minutes needed to descend an altitude at a given vertical speed.",
  id: "aviation/time-to-descent",
  inputs: [
    {
      description: "Altitude to lose.",
      id: "altitudeToLoseFt",
      kind: "number",
      label: "Altitude to lose",
      unit: "ft",
    },
    {
      description: "Sustained vertical speed during the descent.",
      id: "descentRateFpm",
      kind: "number",
      label: "Descent rate",
      unit: "ft/min",
    },
  ],
  outputs: [
    {
      description: "Time required for the descent.",
      format: "duration-min",
      id: "minutes",
      kind: "number",
      label: "Time",
      unit: "min",
    },
  ],
  title: "Time to Descent Calculator",
});
export const runTimeToDescent = timeToDescentTool.execute;
export default timeToDescentTool;
