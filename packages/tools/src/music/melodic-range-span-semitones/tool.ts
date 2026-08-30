import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MelodicRangeSpanSemitonesInput = Readonly<{
  readonly lowestMidi: number;
  readonly highestMidi: number;
}>;
export type MelodicRangeSpanSemitonesOutput = Readonly<{
  readonly rangeSemitones: number;
}>;

export const calculateMelodicRangeSpanSemitones = (
  x: MelodicRangeSpanSemitonesInput,
): MelodicRangeSpanSemitonesOutput => {
  if (!Number.isFinite(x.lowestMidi) || x.lowestMidi < 0)
    simpleError("lowestMidi", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.highestMidi) || x.highestMidi < 0)
    simpleError("highestMidi", "Provide a finite nonnegative number.");
  if (!(
    Number.isInteger(x.lowestMidi) &&
    Number.isInteger(x.highestMidi) &&
    x.highestMidi >= x.lowestMidi &&
    x.highestMidi <= 127
  ))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const rangeSemitones = x.highestMidi - x.lowestMidi;
  if (!Number.isFinite(rangeSemitones))
    simpleError(
      "rangeSemitones",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { rangeSemitones: Object.is(rangeSemitones, -0) ? 0 : rangeSemitones };
};

export const example = {
  input: {
    lowestMidi: 60,
    highestMidi: 72,
  },
  output: { rangeSemitones: 12 },
} satisfies ToolExample<
  MelodicRangeSpanSemitonesInput,
  MelodicRangeSpanSemitonesOutput
>;

export const tool = createSimpleTool({
  id: "music/melodic-range-span-semitones",
  title: "Melodic Range Span Semitones",
  description: "Melodic span in semitones between lower and upper MIDI notes.",
  inputs: [
    { id: "lowestMidi", kind: "number", label: "Lowest Midi", minimum: 0 },
    { id: "highestMidi", kind: "number", label: "Highest Midi", minimum: 0 },
  ],
  outputs: [{ id: "rangeSemitones", kind: "number", label: "Range Semitones" }],
  calculate: (input) =>
    calculateMelodicRangeSpanSemitones({
      lowestMidi: input.lowestMidi as number,
      highestMidi: input.highestMidi as number,
    }),
});
export const melodicRangeSpanSemitonesTool = tool;
export const runMelodicRangeSpanSemitones = tool.execute;
export default tool;
