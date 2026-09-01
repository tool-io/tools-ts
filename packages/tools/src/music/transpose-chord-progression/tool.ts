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
  stepSpell,
  chordSymbol,
} from "../shared.js";
export type Input = Readonly<{
  readonly chordSymbols: readonly string[];
  readonly signedDiatonicSteps: number;
  readonly signedChromaticSemitones: number;
}>;
export type Output = Readonly<{
  readonly transposedChordSymbols: readonly string[];
}>;
const inputFields = [
  { id: "chordSymbols", label: "Chord symbols", kind: "stringList" },
  { id: "signedDiatonicSteps", label: "Signed diatonic steps", kind: "number" },
  {
    id: "signedChromaticSemitones",
    label: "Signed chromatic semitones",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (!input.chordSymbols.length || input.chordSymbols.length > 128)
    simpleError("chords", "1–128 literal chord symbols required.");
  return {
    transposedChordSymbols: input.chordSymbols.map((s) => {
      const c = chordSymbol(s),
        r = namePitch(
          stepSpell(
            c.root,
            input.signedDiatonicSteps,
            input.signedChromaticSemitones,
          ),
        ),
        b = c.bass
          ? "/" +
            namePitch(
              stepSpell(
                c.bass,
                input.signedDiatonicSteps,
                input.signedChromaticSemitones,
              ),
            )
          : "";
      return r + c.suffix + b;
    }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  chordSymbols: ["C", "Am", "F/G"],
  signedDiatonicSteps: 1,
  signedChromaticSemitones: 2,
} satisfies Input;
export const exampleOutput = {
  transposedChordSymbols: ["D", "Bm", "G/A"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/transpose-chord-progression",
  title: "Transpose Chord Progression Tool",
  description:
    "Parse and transpose literal triad/seventh/sus chord progression with preserved suffix/slash bass and diatonic enharmonic spelling; unsupported syntax is rejected rather than guessed.",
  inputs: inputFields,
  outputs: [
    {
      id: "transposedChordSymbols",
      label: "Transposed chord symbols",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      chordSymbols: value.chordSymbols as readonly string[],
      signedDiatonicSteps: value.signedDiatonicSteps as number,
      signedChromaticSemitones: value.signedChromaticSemitones as number,
    }),
});
export const run = tool.execute;
export default tool;
