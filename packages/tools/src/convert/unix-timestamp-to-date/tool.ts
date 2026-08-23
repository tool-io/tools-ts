import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type UnixTimestampToDateInput = {
  readonly unixSeconds?: number;
};

export type UnixTimestampToDateOutput = {
  readonly date: string;
  readonly timeUtc: string;
  readonly iso: string;
};

export const calculateUnixTimestampToDate = (
  input: UnixTimestampToDateInput,
): UnixTimestampToDateOutput => {
  const unixSeconds = input.unixSeconds ?? 0;
  if (Math.abs(unixSeconds) > 8_640_000_000_000)
    simpleError(
      "unixSeconds",
      "Timestamp is outside the supported date range.",
      "out_of_range",
    );
  const milliseconds = unixSeconds * 1000;
  const iso = new Date(milliseconds).toISOString();
  return { date: iso.slice(0, 10), timeUtc: iso.slice(11, 19), iso };
};

export const unixTimestampToDateExample = {
  input: {
    unixSeconds: 1136214245,
  },
  output: {
    date: "2006-01-02",
    timeUtc: "15:04:05",
    iso: "2006-01-02T15:04:05.000Z",
  },
} satisfies ToolExample<UnixTimestampToDateInput, UnixTimestampToDateOutput>;

export const unixTimestampToDateTool = createSimpleTool({
  id: "convert/unix-timestamp-to-date",
  title: "Unix Timestamp to Date Converter",
  description:
    "Convert whole Unix seconds into a UTC calendar date, clock time and ISO 8601 string.",
  inputs: [
    {
      description: "Whole seconds since 1970-01-01T00:00:00Z.",
      default: 0,
      id: "unixSeconds",
      kind: "integer",
      label: "Unix seconds",
    },
  ],
  outputs: [
    {
      description: "UTC calendar date in YYYY-MM-DD format.",
      id: "date",
      kind: "string",
      label: "Date",
    },
    {
      description: "UTC time of day in HH:MM:SS format.",
      id: "timeUtc",
      kind: "string",
      label: "UTC time",
    },
    {
      description: "Full ISO 8601 UTC timestamp.",
      id: "iso",
      kind: "string",
      label: "ISO 8601",
    },
  ],
  calculate: (input) =>
    calculateUnixTimestampToDate({
      unixSeconds: input.unixSeconds as number | undefined,
    }),
});

export const runUnixTimestampToDate = unixTimestampToDateTool.execute;
export default unixTimestampToDateTool;
