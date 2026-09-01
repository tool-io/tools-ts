import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  pitch,
  intervalQuality,
  staffIndex,
} from "../shared.js";
export type Input = Readonly<{
  readonly lowerScientificNote: string;
  readonly upperScientificNote: string;
}>;
export type Output = Readonly<{
  readonly diatonicIntervalNumber: number;
  readonly intervalQualityLabel: string;
  readonly observedSemitoneDistance: number;
}>;
const inputFields = [
  { id: "lowerScientificNote", label: "Lower scientific note", kind: "string" },
  { id: "upperScientificNote", label: "Upper scientific note", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const l = pitch(input.lowerScientificNote, true),
    u = pitch(input.upperScientificNote, true),
    steps = staffIndex(u) - staffIndex(l),
    semitones = u.absolute - l.absolute,
    q = intervalQuality(steps, semitones);
  return {
    diatonicIntervalNumber: q.number,
    intervalQualityLabel: q.quality,
    observedSemitoneDistance: semitones,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  lowerScientificNote: "C4",
  upperScientificNote: "F#4",
} satisfies Input;
export const exampleOutput = {
  diatonicIntervalNumber: 4,
  intervalQualityLabel: "augmented",
  observedSemitoneDistance: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/diminished-augmented-interval-classifier",
  title: "Diminished/Augmented Interval Classifier",
  description:
    "Classify ascending spelled compound intervals by diatonic number and chromatic deviation, distinguishing augmented fourth from diminished fifth at identical semitone count; finite MIDI/domain limits exposed.",
  inputs: inputFields,
  outputs: [
    {
      id: "diatonicIntervalNumber",
      label: "Diatonic interval number",
      kind: "number",
    },
    {
      id: "intervalQualityLabel",
      label: "Interval quality label",
      kind: "string",
    },
    {
      id: "observedSemitoneDistance",
      label: "Observed semitone distance",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      lowerScientificNote: value.lowerScientificNote as string,
      upperScientificNote: value.upperScientificNote as string,
    }),
});
export const run = tool.execute;
export default tool;
