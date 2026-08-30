import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PitchBendSemitoneRange14bitInput = Readonly<{
  readonly bendValue: number;
  readonly bendRangeSemitones: number;
}>;
export type PitchBendSemitoneRange14bitOutput = Readonly<{
  readonly offsetSemitones: number;
}>;

export const calculatePitchBendSemitoneRange14bit = (
  x: PitchBendSemitoneRange14bitInput,
): PitchBendSemitoneRange14bitOutput => {
  if (!Number.isFinite(x.bendValue) || x.bendValue < 0)
    simpleError("bendValue", "Provide a finite nonnegative number.");
  if (!Number.isFinite(x.bendRangeSemitones) || x.bendRangeSemitones <= 0)
    simpleError("bendRangeSemitones", "Provide a finite positive number.");
  if (!(Number.isInteger(x.bendValue) && x.bendValue <= 16383))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const offsetSemitones = ((x.bendValue - 8192) * x.bendRangeSemitones) / 8192;
  if (!Number.isFinite(offsetSemitones))
    simpleError(
      "offsetSemitones",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    offsetSemitones: Object.is(offsetSemitones, -0) ? 0 : offsetSemitones,
  };
};

export const example = {
  input: {
    bendValue: 8192,
    bendRangeSemitones: 2,
  },
  output: { offsetSemitones: 0 },
} satisfies ToolExample<
  PitchBendSemitoneRange14bitInput,
  PitchBendSemitoneRange14bitOutput
>;

export const tool = createSimpleTool({
  id: "music/pitch-bend-semitone-range-14bit",
  title: "Pitch Bend Semitone Range 14bit",
  description:
    "Signed semitone offset from a 14-bit MIDI pitch-bend value using center 8192 and a specified full-scale range.",
  inputs: [
    { id: "bendValue", kind: "number", label: "Bend Value", minimum: 0 },
    {
      id: "bendRangeSemitones",
      kind: "number",
      label: "Bend Range Semitones",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "offsetSemitones", kind: "number", label: "Offset Semitones" },
  ],
  calculate: (input) =>
    calculatePitchBendSemitoneRange14bit({
      bendValue: input.bendValue as number,
      bendRangeSemitones: input.bendRangeSemitones as number,
    }),
});
export const pitchBendSemitoneRange14bitTool = tool;
export const runPitchBendSemitoneRange14bit = tool.execute;
export default tool;
