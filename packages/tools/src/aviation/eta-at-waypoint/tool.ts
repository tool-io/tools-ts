import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EtaAtWaypointInput = {
  readonly departureTime: string;
  readonly distanceNm: number;
  readonly groundSpeedKt: number;
};

export type EtaAtWaypointOutput = {
  readonly elapsedMinutes: number;
  readonly eta: string;
};

const DEPARTURE_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/u;

export const etaAtWaypointExample = {
  input: { departureTime: "14:45", distanceNm: 180, groundSpeedKt: 120 },
  output: { elapsedMinutes: 90, eta: "16:15" },
} satisfies ToolExample<EtaAtWaypointInput, EtaAtWaypointOutput>;

export const calculateEtaAtWaypoint = (
  input: EtaAtWaypointInput,
): EtaAtWaypointOutput => {
  const match = DEPARTURE_PATTERN.exec(input.departureTime);
  if (!match)
    simpleError(
      "departureTime",
      "Enter the departure time in HH:MM format.",
      "invalid_time",
    );
  if (input.distanceNm <= 0)
    simpleError(
      "distanceNm",
      "The distance must be greater than zero.",
      "invalid_distance",
    );
  if (input.groundSpeedKt <= 0)
    simpleError(
      "groundSpeedKt",
      "The ground speed must be greater than zero.",
      "invalid_ground_speed",
    );
  const departureMinutes = Number(match![1]) * 60 + Number(match![2]);
  const elapsedMinutes = (input.distanceNm / input.groundSpeedKt) * 60;
  const arrivalMinutes = Math.floor(departureMinutes + elapsedMinutes) % 1440;
  return {
    elapsedMinutes,
    eta: [Math.floor(arrivalMinutes / 60) % 24, arrivalMinutes % 60]
      .map((part) => String(part).padStart(2, "0"))
      .join(":"),
  };
};

export const etaAtWaypointTool = createSimpleTool({
  calculate: (input) =>
    calculateEtaAtWaypoint(input as unknown as EtaAtWaypointInput),
  description:
    "Estimate the clock time of arrival at a waypoint from a departure time, distance, and ground speed.",
  id: "aviation/eta-at-waypoint",
  inputs: [
    {
      description: "Departure time of day in HH:MM 24-hour format.",
      id: "departureTime",
      kind: "string",
      label: "Departure time",
    },
    {
      description: "Distance to the waypoint.",
      id: "distanceNm",
      kind: "number",
      label: "Distance",
      minimum: 0,
      unit: "nm",
    },
    {
      description: "Ground speed along the route to the waypoint.",
      id: "groundSpeedKt",
      kind: "number",
      label: "Ground speed",
      minimum: 0,
      unit: "kt",
    },
  ],
  outputs: [
    {
      description:
        "Waypoint arrival time of day in HH:MM format, wrapping past midnight.",
      id: "eta",
      kind: "string",
      label: "ETA",
    },
    {
      description: "Total en route minutes used for the estimate.",
      format: "duration-min",
      id: "elapsedMinutes",
      kind: "number",
      label: "Elapsed time",
      unit: "min",
    },
  ],
  title: "ETA at Waypoint Calculator",
});
export const runEtaAtWaypoint = etaAtWaypointTool.execute;
export default etaAtWaypointTool;
