import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
export const speedToPaceTool = createSimpleTool({
  id: "sports/speed-to-pace",
  title: "Speed to Pace Converter",
  description:
    "Convert a speed in kilometers per hour to a running pace in seconds and mm:ss per kilometer.",
  inputs: [
    {
      description: "Speed in kilometers per hour; must be greater than zero.",
      id: "speedKmh",
      label: "Speed",
      kind: "number",
      minimum: 0,
      unit: "km/h",
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
    const speed = input.speedKmh as number;
    if (speed <= 0)
      simpleError(
        "speedKmh",
        "The speed must be greater than zero kilometers per hour.",
        "invalid_speed",
      );
    const paceSecondsPerKm = 3600 / speed;
    const rounded = Math.round(paceSecondsPerKm);
    const wholeMinutes = Math.floor(rounded / 60);
    const seconds = rounded % 60;
    return {
      paceFormatted: `${String(wholeMinutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} /km`,
      paceSecondsPerKm,
    };
  },
});
export const runSpeedToPace = speedToPaceTool.execute;
export default speedToPaceTool;

export type SpeedToPaceInput = {
  readonly speedKmh: number;
};

export type SpeedToPaceOutput = {
  readonly paceSecondsPerKm: number;
  readonly paceFormatted: string;
};

export const speedToPaceExample = {
  input: {
    speedKmh: 1,
  },
  output: {
    paceFormatted: "60:00 /km",
    paceSecondsPerKm: 3600,
  },
} satisfies ToolExample<SpeedToPaceInput, SpeedToPaceOutput>;
