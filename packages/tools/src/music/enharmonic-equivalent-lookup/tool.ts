import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, pitch, namePitch } from "../shared.js";
export type Input = Readonly<{ readonly scientificNote: string }>;
export type Output = Readonly<{
  readonly enharmonicScientificSpellings: readonly string[];
  readonly soundingMidiNote: number;
}>;
const inputFields = [
  { id: "scientificNote", label: "Scientific note", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const p = pitch(input.scientificNote, true),
    letters = "CDEFGAB",
    natural = [0, 2, 4, 5, 7, 9, 11],
    names: string[] = [];
  for (let o = p.octave! - 1; o <= p.octave! + 1; o++)
    for (let l = 0; l < 7; l++) {
      const acc = p.absolute - (12 * (o + 1) + natural[l]);
      if (Math.abs(acc) <= 2) {
        const n =
          letters[l] + (acc > 0 ? "#".repeat(acc) : "b".repeat(-acc)) + o;
        if (n !== namePitch(p)) names.push(n);
      }
    }
  return { enharmonicScientificSpellings: names, soundingMidiNote: p.absolute };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { scientificNote: "C4" } satisfies Input;
export const exampleOutput = {
  enharmonicScientificSpellings: ["B#3", "Dbb4"],
  soundingMidiNote: 60,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/enharmonic-equivalent-lookup",
  title: "Enharmonic Equivalent Lookup",
  description:
    "Enumerate all bounded single/double-accidental enharmonic scientific spellings in adjacent written octaves for the same MIDI pitch, including B/C boundary; original normalized spelling is excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "enharmonicScientificSpellings",
      label: "Enharmonic scientific spellings",
      kind: "stringList",
    },
    { id: "soundingMidiNote", label: "Sounding midi note", kind: "number" },
  ],
  calculate: (value) =>
    calculate({ scientificNote: value.scientificNote as string }),
});
export const run = tool.execute;
export default tool;
