import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  namePitch,
  pc,
  chordIntervals,
  chordSymbol,
  symbolQuality,
} from "../shared.js";
export type Input = Readonly<{ readonly slashChordSymbol: string }>;
export type Output = Readonly<{
  readonly parsedRoot: string;
  readonly parsedBass: string;
  readonly parsedChordQuality: string;
  readonly bassMatchesChordPitchClass: boolean;
  readonly bassChordToneIndex: number;
}>;
const inputFields = [
  { id: "slashChordSymbol", label: "Slash chord symbol", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const c = chordSymbol(input.slashChordSymbol);
  if (!c.bass) return simpleError("slash", "Explicit slash bass required.");
  const q = symbolQuality(c.suffix),
    i = chordIntervals(q).indexOf(pc(c.bass.pitchClass - c.root.pitchClass));
  return {
    parsedRoot: namePitch(c.root),
    parsedBass: namePitch(c.bass),
    parsedChordQuality: q,
    bassMatchesChordPitchClass: i >= 0,
    bassChordToneIndex: i,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { slashChordSymbol: "C/E" } satisfies Input;
export const exampleOutput = {
  parsedRoot: "C",
  parsedBass: "E",
  parsedChordQuality: "major",
  bassMatchesChordPitchClass: true,
  bassChordToneIndex: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/slash-chord-bass-validator",
  title: "Slash Chord Bass Validator",
  description:
    "Validate literal supported chord/slash-bass syntax and distinguish chord-member inversion bass from valid nonchord pedal bass by sounding class; membership false is not rejected syntax or automatic harmonic illegality.",
  inputs: inputFields,
  outputs: [
    { id: "parsedRoot", label: "Parsed root", kind: "string" },
    { id: "parsedBass", label: "Parsed bass", kind: "string" },
    { id: "parsedChordQuality", label: "Parsed chord quality", kind: "string" },
    {
      id: "bassMatchesChordPitchClass",
      label: "Bass matches chord pitch class",
      kind: "boolean",
    },
    {
      id: "bassChordToneIndex",
      label: "Bass chord tone index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({ slashChordSymbol: value.slashChordSymbol as string }),
});
export const run = tool.execute;
export default tool;
