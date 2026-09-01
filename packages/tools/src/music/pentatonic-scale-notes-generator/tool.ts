import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  key,
  namePitch,
  stepSpell,
  modeName,
} from "../shared.js";
export type Input = Readonly<{ readonly tonic: string; readonly mode: string }>;
export type Output = Readonly<{
  readonly spelledPentatonicNotes: readonly string[];
  readonly rootRelativeOffsets: readonly number[];
}>;
const inputFields = [
  { id: "tonic", label: "Tonic", kind: "string" },
  { id: "mode", label: "Mode", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const t = key(input.tonic);
  modeName(input.mode);
  const offsets = input.mode === "major" ? [0, 2, 4, 7, 9] : [0, 3, 5, 7, 10],
    steps = input.mode === "major" ? [0, 1, 2, 4, 5] : [0, 2, 3, 4, 6];
  return {
    spelledPentatonicNotes: offsets.map((v, i) =>
      namePitch(stepSpell(t, steps[i], v)),
    ),
    rootRelativeOffsets: offsets,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { tonic: "Eb", mode: "major" } satisfies Input;
export const exampleOutput = {
  spelledPentatonicNotes: ["Eb", "F", "G", "Bb", "C"],
  rootRelativeOffsets: [0, 2, 4, 7, 9],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/pentatonic-scale-notes-generator",
  title: "Pentatonic Scale Notes Generator",
  description:
    "Generate five distinct correctly spelled major/minor pentatonic tones from explicit tonic/mode, retaining omitted diatonic degrees and double-accidental bounds.",
  inputs: inputFields,
  outputs: [
    {
      id: "spelledPentatonicNotes",
      label: "Spelled pentatonic notes",
      kind: "stringList",
    },
    {
      id: "rootRelativeOffsets",
      label: "Root relative offsets",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({ tonic: value.tonic as string, mode: value.mode as string }),
});
export const run = tool.execute;
export default tool;
