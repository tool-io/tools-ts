import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly lowestMidiNote: number;
  readonly highestMidiNote: number;
  readonly semitoneShift: number;
  readonly performerLowestMidiNote: number;
  readonly performerHighestMidiNote: number;
}>;
export type Output = Readonly<{
  readonly transposedLowestMidiNote: number;
  readonly transposedHighestMidiNote: number;
  readonly fitsPerformerRange: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.lowestMidiNote > input.highestMidiNote ||
    input.performerLowestMidiNote > input.performerHighestMidiNote
  )
    simpleError(
      "lowestMidiNote",
      "Lowest notes cannot exceed highest notes.",
      "invalid_range",
    );
  const transposedLowestMidiNote = input.lowestMidiNote + input.semitoneShift;
  const transposedHighestMidiNote = input.highestMidiNote + input.semitoneShift;
  return {
    transposedLowestMidiNote,
    transposedHighestMidiNote,
    fitsPerformerRange:
      transposedLowestMidiNote >= input.performerLowestMidiNote &&
      transposedHighestMidiNote <= input.performerHighestMidiNote,
  };
};

export const exampleInput = {
  lowestMidiNote: 60,
  highestMidiNote: 72,
  semitoneShift: -2,
  performerLowestMidiNote: 55,
  performerHighestMidiNote: 71,
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  lowestMidiNote: 60,
  highestMidiNote: 72,
  semitoneShift: 5,
  performerLowestMidiNote: 55,
  performerHighestMidiNote: 74,
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      lowestMidiNote: input.lowestMidiNote as number,
      highestMidiNote: input.highestMidiNote as number,
      semitoneShift: input.semitoneShift as number,
      performerLowestMidiNote: input.performerLowestMidiNote as number,
      performerHighestMidiNote: input.performerHighestMidiNote as number,
    }),
  description:
    "Transpose a MIDI-note range and test it against a supplied performer range.",
  id: "theatre/vocal-range-transposition-check",
  inputs: [
    {
      id: "lowestMidiNote",
      label: "Lowest source MIDI note",
      kind: "integer",
      minimum: 0,
      maximum: 127,
    },
    {
      id: "highestMidiNote",
      label: "Highest source MIDI note",
      kind: "integer",
      minimum: 0,
      maximum: 127,
    },
    { id: "semitoneShift", label: "Semitone shift", kind: "integer" },
    {
      id: "performerLowestMidiNote",
      label: "Performer lowest MIDI note",
      kind: "integer",
      minimum: 0,
      maximum: 127,
    },
    {
      id: "performerHighestMidiNote",
      label: "Performer highest MIDI note",
      kind: "integer",
      minimum: 0,
      maximum: 127,
    },
  ],
  outputs: [
    {
      id: "transposedLowestMidiNote",
      label: "Transposed lowest MIDI note",
      kind: "integer",
    },
    {
      id: "transposedHighestMidiNote",
      label: "Transposed highest MIDI note",
      kind: "integer",
    },
    {
      id: "fitsPerformerRange",
      label: "Fits performer range",
      kind: "boolean",
    },
  ],
  title: "Vocal Range Transposition Check",
});

export const run = tool.execute;
export default tool;
