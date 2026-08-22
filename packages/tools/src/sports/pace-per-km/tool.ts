import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const pacePerKmTool = createSimpleTool({
  id: "sports/pace-per-km",
  title: "Pace Per Kilometer Calculator",
  description:
    "Calculate running pace in seconds and mm:ss per kilometer from a distance and duration.",
  inputs: [
    {
      description: "Distance covered in kilometers; must be greater than zero.",
      id: "distanceKm",
      label: "Distance",
      kind: "number",
      minimum: 0,
      unit: "km",
    },
    {
      id: "minutes",
      label: "Duration",
      kind: "number",
      minimum: 0,
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Seconds needed per kilometer.",
      id: "paceSecondsPerKm",
      label: "Pace",
      kind: "number",
      unit: "s/km",
    },
    {
      description: "Pace formatted as mm:ss per kilometer.",
      id: "paceFormatted",
      label: "Formatted pace",
      kind: "string",
    },
  ],
  calculate: (input) => {
    const distance = input.distanceKm as number;
    if (distance <= 0)
      simpleError(
        "distanceKm",
        "The distance must be greater than zero kilometers.",
        "invalid_distance",
      );
    const paceSecondsPerKm = ((input.minutes as number) * 60) / distance;
    const rounded = Math.round(paceSecondsPerKm);
    const wholeMinutes = Math.floor(rounded / 60);
    const seconds = rounded % 60;
    const paddedSeconds = String(seconds).padStart(2, "0");
    return {
      paceSecondsPerKm,
      paceFormatted: `${String(wholeMinutes).padStart(2, "0")}:${paddedSeconds} /km`,
    };
  },
});
export const runPacePerKm = pacePerKmTool.execute;
export default pacePerKmTool;

export type PacePerKmInput = {
  readonly distanceKm: number;
  readonly minutes: number;
};

export type PacePerKmOutput = {
  readonly paceSecondsPerKm: number;
  readonly paceFormatted: string;
};

export const pacePerKmExample = {
  input: {
    distanceKm: 1,
    minutes: 1,
  },
  output: {
    paceSecondsPerKm: 60,
    paceFormatted: "01:00 /km",
  },
} satisfies ToolExample<PacePerKmInput, PacePerKmOutput>;
