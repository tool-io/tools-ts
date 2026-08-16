import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { parsePlainDate } from "../../core/date.js";

export type DateToUnixTimestampInput = {
  readonly date: string;
  readonly time?: string;
};

export type DateToUnixTimestampOutput = {
  readonly unixMilliseconds: number;
  readonly unixSeconds: number;
};

export const dateToUnixTimestampExample = {
  input: { date: "1970-01-01" },
  output: { unixMilliseconds: 0, unixSeconds: 0 },
} satisfies ToolExample<DateToUnixTimestampInput, DateToUnixTimestampOutput>;

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/u;

export const calculateDateToUnixTimestamp = (
  input: DateToUnixTimestampInput,
): DateToUnixTimestampOutput => {
  const midnight = parsePlainDate(input.date as string);
  const time = input.time ?? "00:00:00";
  const match = TIME_PATTERN.exec(time as string);
  if (!match)
    simpleError("time", "Enter a time in HH:MM:SS format.", "invalid_time");
  const milliseconds =
    midnight +
    Number(match![1]) * 3_600_000 +
    Number(match![2]) * 60_000 +
    Number(match![3]) * 1_000;
  return {
    unixMilliseconds: milliseconds,
    unixSeconds: Math.floor(milliseconds / 1000),
  };
};

export const dateToUnixTimestampTool = createSimpleTool({
  calculate: (input) =>
    calculateDateToUnixTimestamp(input as unknown as DateToUnixTimestampInput),
  description:
    "Convert a calendar date and optional UTC time into a Unix timestamp.",
  id: "convert/date-to-unix-timestamp",
  inputs: [
    {
      description: "Calendar date in YYYY-MM-DD format, interpreted in UTC.",
      id: "date",
      kind: "string",
      label: "Date",
    },
    {
      default: "00:00:00",
      description: "UTC time of day in HH:MM:SS format.",
      id: "time",
      kind: "string",
      label: "Time",
    },
  ],
  outputs: [
    {
      description: "Whole seconds since the Unix epoch.",
      format: "unix-seconds",
      id: "unixSeconds",
      kind: "integer",
      label: "Unix seconds",
    },
    {
      description: "Milliseconds since the Unix epoch.",
      format: "unix-milliseconds",
      id: "unixMilliseconds",
      kind: "integer",
      label: "Unix milliseconds",
    },
  ],
  title: "Date to Unix Timestamp Converter",
});
export const runDateToUnixTimestamp = dateToUnixTimestampTool.execute;
export default dateToUnixTimestampTool;
