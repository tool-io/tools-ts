import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type FlightTimeInput = {
  readonly distanceNm: number;
  readonly groundSpeedKt: number;
};

export type FlightTimeOutput = {
  readonly flightHours: number;
};

export const flightTimeExample = {
  input: { distanceNm: 300, groundSpeedKt: 120 },
  output: { flightHours: 2.5 },
} satisfies ToolExample<FlightTimeInput, FlightTimeOutput>;

export const calculateFlightTime = (
  input: FlightTimeInput,
): FlightTimeOutput => {
  if (input.groundSpeedKt <= 0)
    simpleError(
      "groundSpeedKt",
      "The ground speed must be positive.",
      "invalid_speed",
    );
  if (input.distanceNm < 0)
    simpleError(
      "distanceNm",
      "The distance cannot be negative.",
      "invalid_distance",
    );
  return {
    flightHours: roundStatistic(input.distanceNm / input.groundSpeedKt),
  };
};

export const flightTimeTool = createSimpleTool({
  calculate: (input) =>
    calculateFlightTime(input as unknown as FlightTimeInput),
  description:
    "Compute the flight time over a distance at a given ground speed.",
  id: "aviation/flight-time",
  inputs: [
    {
      description: "Distance to fly.",
      id: "distanceNm",
      kind: "number",
      label: "Distance",
      unit: "nm",
    },
    {
      description: "Ground speed over the route.",
      id: "groundSpeedKt",
      kind: "number",
      label: "Ground speed",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Flight time.",
      format: "duration-h",
      id: "flightHours",
      kind: "number",
      label: "Flight time",
      unit: "h",
    },
  ],
  title: "Flight Time Calculator",
});
export const runFlightTime = flightTimeTool.execute;
export default flightTimeTool;
