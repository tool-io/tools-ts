import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NoteValueDurationSecondsAtBpmInput = Readonly<{
  readonly quarterNoteMultiples: number;
  readonly beatsPerMinute: number;
}>;
export type NoteValueDurationSecondsAtBpmOutput = Readonly<{
  readonly durationSeconds: number;
}>;

export const calculateNoteValueDurationSecondsAtBpm = (
  x: NoteValueDurationSecondsAtBpmInput,
): NoteValueDurationSecondsAtBpmOutput => {
  if (!Number.isFinite(x.quarterNoteMultiples) || x.quarterNoteMultiples <= 0)
    simpleError("quarterNoteMultiples", "Provide a finite positive number.");
  if (!Number.isFinite(x.beatsPerMinute) || x.beatsPerMinute <= 0)
    simpleError("beatsPerMinute", "Provide a finite positive number.");
  const durationSeconds = (60 * x.quarterNoteMultiples) / x.beatsPerMinute;
  if (!Number.isFinite(durationSeconds))
    simpleError(
      "durationSeconds",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    durationSeconds: Object.is(durationSeconds, -0) ? 0 : durationSeconds,
  };
};

export const example = {
  input: {
    quarterNoteMultiples: 1,
    beatsPerMinute: 120,
  },
  output: { durationSeconds: 0.5 },
} satisfies ToolExample<
  NoteValueDurationSecondsAtBpmInput,
  NoteValueDurationSecondsAtBpmOutput
>;

export const tool = createSimpleTool({
  id: "music/note-value-duration-seconds-at-bpm",
  title: "Note Value Duration Seconds At Bpm",
  description:
    "Duration in seconds of a note expressed as quarter-note multiples at a quarter-note BPM.",
  inputs: [
    {
      id: "quarterNoteMultiples",
      kind: "number",
      label: "Quarter Note Multiples",
      minimum: 0,
    },
    {
      id: "beatsPerMinute",
      kind: "number",
      label: "Beats Per Minute",
      unit: "bpm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "durationSeconds",
      kind: "number",
      label: "Duration Seconds",
      unit: "s",
    },
  ],
  calculate: (input) =>
    calculateNoteValueDurationSecondsAtBpm({
      quarterNoteMultiples: input.quarterNoteMultiples as number,
      beatsPerMinute: input.beatsPerMinute as number,
    }),
});
export const noteValueDurationSecondsAtBpmTool = tool;
export const runNoteValueDurationSecondsAtBpm = tool.execute;
export default tool;
