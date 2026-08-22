import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EtaInput = {
  readonly departureTime: string;
  readonly flightHours: number;
};

export type EtaOutput = {
  readonly dayOffset: number;
  readonly etaTime: string;
};

const DEPARTURE_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/u;

export const etaExample = {
  input: { departureTime: "14:45", flightHours: 2.5 },
  output: { dayOffset: 0, etaTime: "17:15" },
} satisfies ToolExample<EtaInput, EtaOutput>;

export const calculateEta = (input: EtaInput): EtaOutput => {
  if (input.flightHours < 0)
    simpleError(
      "flightHours",
      "The flight time cannot be negative.",
      "invalid_flight_time",
    );
  const match = DEPARTURE_PATTERN.exec(input.departureTime);
  if (!match)
    simpleError(
      "departureTime",
      "Enter the departure time in HH:MM format.",
      "invalid_departure_time",
    );
  const departureMinutes = Number(match![1]) * 60 + Number(match![2]);
  const totalMinutes = departureMinutes + Math.round(input.flightHours * 60);
  return {
    dayOffset: Math.floor(totalMinutes / 1440),
    etaTime: [Math.floor(totalMinutes / 60) % 24, totalMinutes % 60]
      .map((part) => String(part).padStart(2, "0"))
      .join(":"),
  };
};

export const etaTool = createSimpleTool({
  calculate: (input) => calculateEta(input as unknown as EtaInput),
  description:
    "Compute the estimated time of arrival from a departure clock time and flight duration.",
  id: "aviation/eta",
  inputs: [
    {
      description: "Departure time of day in HH:MM format.",
      id: "departureTime",
      kind: "string",
      label: "Departure",
    },
    {
      description: "Flight time in hours; may cross midnight.",
      id: "flightHours",
      kind: "number",
      label: "Flight time",
      unit: "h",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Arrival time of day in HH:MM format, wrapping past midnight.",
      id: "etaTime",
      kind: "string",
      label: "ETA",
    },
    {
      description:
        "Whole days added by the flight, zero for same-day arrivals.",
      id: "dayOffset",
      kind: "integer",
      label: "Day offset",
    },
  ],
  title: "ETA Calculator",
});
export const runEta = etaTool.execute;
export default etaTool;
