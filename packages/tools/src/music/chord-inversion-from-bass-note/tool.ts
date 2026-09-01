import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  ordered,
  pitch,
  pc,
  tertianQuality,
  seventhQuality,
} from "../shared.js";
export type Input = Readonly<{
  readonly rootScientificNote: string;
  readonly orderedChordScientificNotes: readonly string[];
  readonly actualBassScientificNote: string;
}>;
export type Output = Readonly<{
  readonly inversionNumber: number;
  readonly bassIsChordMember: boolean;
  readonly recognizedTertianChordQuality: string;
}>;
const inputFields = [
  { id: "rootScientificNote", label: "Root scientific note", kind: "string" },
  {
    id: "orderedChordScientificNotes",
    label: "Ordered chord scientific notes",
    kind: "stringList",
  },
  {
    id: "actualBassScientificNote",
    label: "Actual bass scientific note",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const root = pitch(input.rootScientificNote, true),
    notes = input.orderedChordScientificNotes.map((s) => pitch(s, true)),
    bass = pitch(input.actualBassScientificNote, true);
  if (notes.length < 3 || notes.length > 4)
    simpleError(
      "chord",
      "Root/third/fifth and optional seventh required in tertian order.",
    );
  const offsets = notes.map((p) => pc(p.pitchClass - root.pitchClass)),
    q = notes.length === 3 ? tertianQuality(offsets) : seventhQuality(offsets);
  if (
    q === "unrecognized" ||
    offsets[0] !== 0 ||
    new Set(offsets).size !== notes.length ||
    notes.some((p, i) => (p.letter - root.letter + 7) % 7 !== (2 * i) % 7)
  )
    simpleError(
      "chord",
      "Correctly spelled ordered supported tertian chord required.",
    );
  const index = notes.findIndex(
    (p) => p.pitchClass === bass.pitchClass && p.letter === bass.letter,
  );
  return {
    inversionNumber: index,
    bassIsChordMember: index >= 0,
    recognizedTertianChordQuality: q,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rootScientificNote: "C4",
  orderedChordScientificNotes: ["C4", "E4", "G4"],
  actualBassScientificNote: "E3",
} satisfies Input;
export const exampleOutput = {
  inversionNumber: 1,
  bassIsChordMember: true,
  recognizedTertianChordQuality: "major",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/chord-inversion-from-bass-note",
  title: "Chord Inversion From Bass Note",
  description:
    "Identify inversion by supplied actual bass in a spelled root/third/fifth/seventh chord, with nonchord bass retained as −1; unlike slash syntax parsing, checks real chord order/quality and octave-independent membership.",
  inputs: inputFields,
  outputs: [
    { id: "inversionNumber", label: "Inversion number", kind: "number" },
    { id: "bassIsChordMember", label: "Bass is chord member", kind: "boolean" },
    {
      id: "recognizedTertianChordQuality",
      label: "Recognized tertian chord quality",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      rootScientificNote: value.rootScientificNote as string,
      orderedChordScientificNotes:
        value.orderedChordScientificNotes as readonly string[],
      actualBassScientificNote: value.actualBassScientificNote as string,
    }),
});
export const run = tool.execute;
export default tool;
