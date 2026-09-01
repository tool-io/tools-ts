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
  readonly spelledBluesNotes: readonly string[];
  readonly rootRelativeBluesOffsets: readonly number[];
}>;
const inputFields = [
  { id: "tonic", label: "Tonic", kind: "string" },
  { id: "mode", label: "Mode", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const t = key(input.tonic);
  modeName(input.mode);
  const offsets =
      input.mode === "minor" ? [0, 3, 5, 6, 7, 10] : [0, 2, 3, 4, 7, 9],
    steps = input.mode === "minor" ? [0, 2, 3, 4, 4, 6] : [0, 1, 2, 2, 4, 5];
  return {
    spelledBluesNotes: offsets.map((v, i) =>
      namePitch(stepSpell(t, steps[i], v)),
    ),
    rootRelativeBluesOffsets: offsets,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { tonic: "C", mode: "minor" } satisfies Input;
export const exampleOutput = {
  spelledBluesNotes: ["C", "Eb", "F", "Gb", "G", "Bb"],
  rootRelativeBluesOffsets: [0, 3, 5, 6, 7, 10],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/blues-scale-notes-generator",
  title: "Blues Scale Notes Generator",
  description:
    "Generate six-tone minor/major blues collection with explicitly spelled blue fifth/third, not generic chromatic aliases or promised blues harmony fit.",
  inputs: inputFields,
  outputs: [
    {
      id: "spelledBluesNotes",
      label: "Spelled blues notes",
      kind: "stringList",
    },
    {
      id: "rootRelativeBluesOffsets",
      label: "Root relative blues offsets",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({ tonic: value.tonic as string, mode: value.mode as string }),
});
export const run = tool.execute;
export default tool;
