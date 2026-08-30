import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MinuteRepeaterSequenceInput = {
  readonly hour: number;
  readonly minute: number;
};

export type MinuteRepeaterSequenceOutput = {
  readonly hourStrikes: number;
  readonly minuteStrikes: number;
  readonly quarterStrikePairs: number;
  readonly totalStrikes: number;
};

export const mapMinuteRepeaterStrikeSequence = (
  input: MinuteRepeaterSequenceInput,
): MinuteRepeaterSequenceOutput => {
  if (!Number.isSafeInteger(input.hour) || input.hour < 1 || input.hour > 12)
    simpleError(
      "hour",
      "Hour must be an integer from 1 through 12.",
      "hour_out_of_range",
    );
  if (
    !Number.isSafeInteger(input.minute) ||
    input.minute < 0 ||
    input.minute > 59
  )
    simpleError(
      "minute",
      "Minute must be an integer from 0 through 59.",
      "minute_out_of_range",
    );
  const quarterStrikePairs = Math.floor(input.minute / 15);
  const hourStrikes = input.hour === 12 ? 12 : input.hour;
  const minuteStrikes = input.minute % 15;
  return {
    hourStrikes,
    minuteStrikes,
    quarterStrikePairs,
    totalStrikes: hourStrikes + 2 * quarterStrikePairs + minuteStrikes,
  };
};

export const minuteRepeaterSequenceExample = {
  input: { hour: 10, minute: 9 },
  output: {
    hourStrikes: 10,
    minuteStrikes: 9,
    quarterStrikePairs: 0,
    totalStrikes: 19,
  },
} satisfies ToolExample<
  MinuteRepeaterSequenceInput,
  MinuteRepeaterSequenceOutput
>;

export const minuteRepeaterSequenceTool = createSimpleTool({
  calculate: (input) =>
    mapMinuteRepeaterStrikeSequence({
      hour: input.hour as number,
      minute: input.minute as number,
    }),
  description:
    "Count hammer strikes for a two-gong minute repeater: hours, paired quarter-hour strikes, then minutes since the quarter.",
  id: "horology/minute-repeater-strike-count",
  inputs: [
    {
      id: "hour",
      kind: "integer",
      label: "Hour on 12-hour dial",
      maximum: 12,
      minimum: 1,
    },
    { id: "minute", kind: "integer", label: "Minute", maximum: 59, minimum: 0 },
  ],
  outputs: [
    {
      id: "hourStrikes",
      kind: "integer",
      label: "Low-gong hour strikes",
      maximum: 12,
      minimum: 1,
    },
    {
      id: "minuteStrikes",
      kind: "integer",
      label: "High-gong minute strikes",
      maximum: 14,
      minimum: 0,
    },
    {
      id: "quarterStrikePairs",
      kind: "integer",
      label: "High-low quarter pairs",
      maximum: 3,
      minimum: 0,
    },
    {
      id: "totalStrikes",
      kind: "integer",
      label: "Total hammer strikes",
      maximum: 32,
      minimum: 1,
    },
  ],
  title: "Minute Repeater Strike Count",
});

export const runMinuteRepeaterSequence = minuteRepeaterSequenceTool.execute;
export default minuteRepeaterSequenceTool;
