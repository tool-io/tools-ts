import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimeToWaypointSailingInput = {
  readonly distanceNm: number;
  readonly speedKt: number;
};

export type TimeToWaypointSailingOutput = {
  readonly timeMinutes: number;
};

export const timeToWaypointSailingExample = {
  input: { distanceNm: 12, speedKt: 6 },
  output: { timeMinutes: 120 },
} satisfies ToolExample<
  TimeToWaypointSailingInput,
  TimeToWaypointSailingOutput
>;

export const timeToWaypointSailingTool = createSimpleTool({
  calculate: (input) => {
    const distanceNm = input.distanceNm as number;
    const speedKt = input.speedKt as number;
    if (distanceNm <= 0)
      simpleError("distanceNm", "Distance must be positive.", "invalid_input");
    if (speedKt <= 0)
      simpleError("speedKt", "Speed must be positive.", "invalid_input");
    return { timeMinutes: (distanceNm / speedKt) * 60 };
  },
  description:
    "Calculate sailing time to a waypoint in minutes using timeMinutes = distanceNm / speedKt * 60.",
  id: "sailing/time-to-waypoint-sailing",
  inputs: [
    {
      description: "Distance remaining to the waypoint.",
      id: "distanceNm",
      kind: "number",
      label: "Distance",
      unit: "nm",
    },
    {
      description: "Boat speed over the water or through the water.",
      id: "speedKt",
      kind: "number",
      label: "Speed",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Time until the waypoint is reached.",
      id: "timeMinutes",
      kind: "number",
      label: "Time to waypoint",
      unit: "min",
    },
  ],
  title: "Time to Waypoint Calculator",
});
export const runTimeToWaypointSailing = timeToWaypointSailingTool.execute;
export default timeToWaypointSailingTool;
