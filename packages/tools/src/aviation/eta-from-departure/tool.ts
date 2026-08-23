import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EtaFromDepartureInput = {
  readonly departureTime: string;
  readonly flightTimeMinutes: number;
};

export type EtaFromDepartureOutput = {
  readonly arrivalMinuteOfDay: number;
  readonly eta: string;
};

const DEPARTURE_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/u;

export const etaFromDepartureExample = {
  input: { departureTime: "14:45", flightTimeMinutes: 90 },
} satisfies ToolExample<EtaFromDepartureInput>;

export const etaFromDepartureTool = createSimpleTool({
  id: "aviation/eta-from-departure",
  title: "ETA From Departure Calculator",
  description:
    "Add a flight time in minutes to a departure time of day, wrapping past midnight.",
  inputs: [
    {
      description: "Departure time of day in HH:MM 24-hour format.",
      id: "departureTime",
      label: "Departure time",
      kind: "string",
    },
    {
      id: "flightTimeMinutes",
      label: "Flight time",
      kind: "number",
      unit: "min",
    },
  ],
  outputs: [
    {
      description: "Arrival time of day in zero-padded HH:MM format.",
      id: "eta",
      kind: "string",
      label: "ETA",
    },
    {
      id: "arrivalMinuteOfDay",
      kind: "integer",
      label: "Arrival minute of day",
      unit: "min",
    },
  ],
  calculate: (input) => {
    const departureTime = input.departureTime as string;
    const flightTimeMinutes = input.flightTimeMinutes as number;
    if (!DEPARTURE_PATTERN.test(departureTime))
      simpleError(
        "departureTime",
        "Enter the departure time in HH:MM format.",
        "invalid_time",
      );
    if (flightTimeMinutes <= 0)
      simpleError(
        "flightTimeMinutes",
        "The flight time must be greater than zero.",
      );
    const [hours, minutes] = departureTime.split(":");
    const departureMinutes = Number(hours) * 60 + Number(minutes);
    const arrivalMinutes =
      Math.round(departureMinutes + flightTimeMinutes) % 1440;
    return {
      arrivalMinuteOfDay: arrivalMinutes,
      eta: `${String(Math.floor(arrivalMinutes / 60)).padStart(2, "0")}:${String(
        arrivalMinutes % 60,
      ).padStart(2, "0")}`,
    };
  },
});
export const runEtaFromDeparture = etaFromDepartureTool.execute;
export default etaFromDepartureTool;
