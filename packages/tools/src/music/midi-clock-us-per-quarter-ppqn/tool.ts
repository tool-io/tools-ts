import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MidiClockUsPerQuarterPpqnInput = Readonly<{
  readonly beatsPerMinute: number;
  readonly pulsesPerQuarter: number;
}>;
export type MidiClockUsPerQuarterPpqnOutput = Readonly<{
  readonly microsecondsPerPulse: number;
}>;

export const calculateMidiClockUsPerQuarterPpqn = (
  x: MidiClockUsPerQuarterPpqnInput,
): MidiClockUsPerQuarterPpqnOutput => {
  if (!Number.isFinite(x.beatsPerMinute) || x.beatsPerMinute <= 0)
    simpleError("beatsPerMinute", "Provide a finite positive number.");
  if (
    !Number.isFinite(x.pulsesPerQuarter) ||
    !Number.isSafeInteger(x.pulsesPerQuarter) ||
    x.pulsesPerQuarter < 1
  )
    simpleError("pulsesPerQuarter", "Provide a positive safe integer.");
  const microsecondsPerPulse =
    60000000 / (x.beatsPerMinute * x.pulsesPerQuarter);
  if (!Number.isFinite(microsecondsPerPulse))
    simpleError(
      "microsecondsPerPulse",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    microsecondsPerPulse: Object.is(microsecondsPerPulse, -0)
      ? 0
      : microsecondsPerPulse,
  };
};

export const example = {
  input: {
    beatsPerMinute: 120,
    pulsesPerQuarter: 24,
  },
  output: { microsecondsPerPulse: 20833.333333333332 },
} satisfies ToolExample<
  MidiClockUsPerQuarterPpqnInput,
  MidiClockUsPerQuarterPpqnOutput
>;

export const tool = createSimpleTool({
  id: "music/midi-clock-us-per-quarter-ppqn",
  title: "Midi Clock Us Per Quarter Ppqn",
  description:
    "Microseconds between sequencer pulses for BPM and pulses per quarter note (PPQN).",
  inputs: [
    {
      id: "beatsPerMinute",
      kind: "number",
      label: "Beats Per Minute",
      unit: "bpm",
      minimum: 0,
    },
    {
      id: "pulsesPerQuarter",
      kind: "integer",
      label: "Pulses Per Quarter",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "microsecondsPerPulse",
      kind: "number",
      label: "Microseconds Per Pulse",
      unit: "us",
    },
  ],
  calculate: (input) =>
    calculateMidiClockUsPerQuarterPpqn({
      beatsPerMinute: input.beatsPerMinute as number,
      pulsesPerQuarter: input.pulsesPerQuarter as number,
    }),
});
export const midiClockUsPerQuarterPpqnTool = tool;
export const runMidiClockUsPerQuarterPpqn = tool.execute;
export default tool;
