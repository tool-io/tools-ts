import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimeToStartLineInput = {
  readonly distanceToLineNm: number;
  readonly boatSpeedKt: number;
};

export type TimeToStartLineOutput = {
  readonly timeMinutes: number;
};

export const calculateTimeToStartLine = (
  distanceToLineNm: number,
  boatSpeedKt: number,
): number | null =>
  Number.isFinite(distanceToLineNm) &&
  Number.isFinite(boatSpeedKt) &&
  distanceToLineNm > 0 &&
  boatSpeedKt > 0
    ? (distanceToLineNm / boatSpeedKt) * 60
    : null;

export const timeToStartLineExample = {
  input: { distanceToLineNm: 0.5, boatSpeedKt: 6 },
  output: { timeMinutes: 5 },
} satisfies ToolExample<TimeToStartLineInput, TimeToStartLineOutput>;

export const timeToStartLineTool = createSimpleTool({
  id: "sailing/time-to-start-line",
  title: "Time to Start Line Calculator",
  description:
    "Calculate how many minutes it takes to reach the start line from the remaining distance and current boat speed.",
  inputs: [
    {
      id: "distanceToLineNm",
      kind: "number",
      label: "Distance to line",
      unit: "nm",
    },
    { id: "boatSpeedKt", kind: "number", label: "Boat speed", unit: "kt" },
  ],
  outputs: [
    {
      format: "time-min",
      id: "timeMinutes",
      kind: "number",
      label: "Time to start line",
      unit: "min",
    },
  ],
  calculate: (input) => {
    const distance = input.distanceToLineNm as number;
    const speed = input.boatSpeedKt as number;
    const timeMinutes = calculateTimeToStartLine(distance, speed);
    if (timeMinutes === null)
      simpleError(
        distance <= 0 ? "distanceToLineNm" : "boatSpeedKt",
        "Enter a positive distance and boat speed.",
        distance <= 0 ? "invalid_distance" : "invalid_speed",
      );
    return { timeMinutes };
  },
});

export const runTimeToStartLine = timeToStartLineTool.execute;
export default timeToStartLineTool;
