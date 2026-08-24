import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LinesPerHourPackStationInput = {
  readonly linesPacked: number;
  readonly stationHours: number;
};

export type LinesPerHourPackStationOutput = {
  readonly linesPerHour: number;
};

export const calculateLinesPerHourPackStation = (
  input: LinesPerHourPackStationInput,
): LinesPerHourPackStationOutput => {
  if (!Number.isFinite(input.stationHours) || input.stationHours <= 0)
    return simpleError(
      "stationHours",
      "Packing station hours must be finite and greater than zero.",
      "invalid_hours",
    );
  if (!Number.isSafeInteger(input.linesPacked) || input.linesPacked < 0)
    return simpleError(
      "linesPacked",
      "Lines packed must be a non-negative safe integer.",
      "invalid_lines",
    );
  if (input.linesPacked === 0) return { linesPerHour: 0 };
  const linesPerHour = input.linesPacked / input.stationHours;
  if (!Number.isFinite(linesPerHour))
    return simpleError(
      "stationHours",
      "Lines per hour is too large to represent.",
      "result_out_of_range",
    );
  return { linesPerHour };
};

export const linesPerHourPackStationExample = {
  input: { linesPacked: 240, stationHours: 5 },
  output: { linesPerHour: 48 },
} satisfies ToolExample<
  LinesPerHourPackStationInput,
  LinesPerHourPackStationOutput
>;

export const linesPerHourPackStationTool = createSimpleTool({
  id: "logistics/lines-per-hour-pack-station",
  title: "Lines Per Hour Pack Station Calculator",
  description:
    "Compute pack-station throughput in order lines packed per station labor hour.",
  inputs: [
    {
      description: "Order lines packed in the period.",
      id: "linesPacked",
      kind: "integer",
      label: "Lines packed",
      minimum: 0,
    },
    {
      description:
        "Total packing labor hours at the station in the same period.",
      id: "stationHours",
      kind: "number",
      label: "Station hours",
      minimum: Number.MIN_VALUE,
      unit: "h",
    },
  ],
  outputs: [
    {
      description: "Order lines packed per station labor hour.",
      id: "linesPerHour",
      kind: "number",
      label: "Lines per hour",
      minimum: 0,
      unit: "lines/h",
    },
  ],
  calculate: (input) =>
    calculateLinesPerHourPackStation({
      linesPacked: input.linesPacked as number,
      stationHours: input.stationHours as number,
    }),
});

export const runLinesPerHourPackStation = linesPerHourPackStationTool.execute;
export default linesPerHourPackStationTool;
