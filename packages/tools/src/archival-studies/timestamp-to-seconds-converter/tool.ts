import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TimestampToSecondsConverterInput = {
  readonly timestamp: string;
};

export type TimestampToSecondsConverterOutput = {
  readonly seconds: number;
};

const TIMESTAMP_PATTERN = /^(\d{1,4}):([0-5]\d):([0-5]\d)$/;

export const calculateTimestampToSecondsConverter = (
  input: TimestampToSecondsConverterInput,
): TimestampToSecondsConverterOutput => {
  const match = TIMESTAMP_PATTERN.exec(input.timestamp);
  if (!match)
    return simpleError(
      "timestamp",
      "Timestamp must use the hh:mm:ss format with minutes and seconds from 00 to 59.",
      "invalid_timestamp",
    );
  const seconds =
    Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
  return { seconds };
};

export const timestampToSecondsConverterExample = {
  input: { timestamp: "01:23:45" },
  output: { seconds: 5025 },
} satisfies ToolExample<
  TimestampToSecondsConverterInput,
  TimestampToSecondsConverterOutput
>;

export const timestampToSecondsConverterTool = createSimpleTool({
  id: "archival-studies/timestamp-to-seconds-converter",
  title: "Interview Timestamp hh:mm:ss to Seconds Converter",
  description:
    "Convert an oral history interview timestamp in hh:mm:ss notation into total elapsed seconds for playback and sync workflows.",
  inputs: [
    {
      description: "Elapsed-time timestamp formatted as hh:mm:ss.",
      id: "timestamp",
      kind: "string",
      label: "Timestamp",
    },
  ],
  outputs: [
    {
      description: "Total seconds represented by the timestamp.",
      id: "seconds",
      kind: "integer",
      label: "Seconds",
    },
  ],
  calculate: (input) =>
    calculateTimestampToSecondsConverter({
      timestamp: input.timestamp as string,
    }),
});

export const runTimestampToSecondsConverter =
  timestampToSecondsConverterTool.execute;
export default timestampToSecondsConverterTool;
