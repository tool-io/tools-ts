import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DelayTimeSyncedToNoteValueInput = Readonly<{
  readonly beatsPerMinute: number;
  readonly quarterNoteMultiples: number;
}>;
export type DelayTimeSyncedToNoteValueOutput = Readonly<{
  readonly delayMilliseconds: number;
}>;

export const calculateDelayTimeSyncedToNoteValue = (
  x: DelayTimeSyncedToNoteValueInput,
): DelayTimeSyncedToNoteValueOutput => {
  if (!Number.isFinite(x.beatsPerMinute) || x.beatsPerMinute <= 0)
    simpleError("beatsPerMinute", "Provide a finite positive number.");
  if (!Number.isFinite(x.quarterNoteMultiples) || x.quarterNoteMultiples <= 0)
    simpleError("quarterNoteMultiples", "Provide a finite positive number.");
  const delayMilliseconds = (60000 * x.quarterNoteMultiples) / x.beatsPerMinute;
  if (!Number.isFinite(delayMilliseconds))
    simpleError(
      "delayMilliseconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    delayMilliseconds: Object.is(delayMilliseconds, -0) ? 0 : delayMilliseconds,
  };
};

export const example = {
  input: {
    beatsPerMinute: 120,
    quarterNoteMultiples: 1,
  },
  output: { delayMilliseconds: 500 },
} satisfies ToolExample<
  DelayTimeSyncedToNoteValueInput,
  DelayTimeSyncedToNoteValueOutput
>;

export const tool = createSimpleTool({
  id: "music/delay-time-synced-to-note-value",
  title: "Delay Time Synced To Note Value",
  description:
    "Tempo-synced delay time in milliseconds for a note expressed in quarter-note multiples.",
  inputs: [
    {
      id: "beatsPerMinute",
      kind: "number",
      label: "Beats Per Minute",
      unit: "bpm",
      minimum: 0,
    },
    {
      id: "quarterNoteMultiples",
      kind: "number",
      label: "Quarter Note Multiples",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "delayMilliseconds",
      kind: "number",
      label: "Delay Milliseconds",
      unit: "ms",
    },
  ],
  calculate: (input) =>
    calculateDelayTimeSyncedToNoteValue({
      beatsPerMinute: input.beatsPerMinute as number,
      quarterNoteMultiples: input.quarterNoteMultiples as number,
    }),
});
export const delayTimeSyncedToNoteValueTool = tool;
export const runDelayTimeSyncedToNoteValue = tool.execute;
export default tool;
