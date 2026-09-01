import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, midi } from "../shared.js";
export type Input = Readonly<{
  readonly firstVoiceMidiPair: readonly number[];
  readonly secondVoiceMidiPair: readonly number[];
}>;
export type Output = Readonly<{
  readonly twoVoiceMotionClass: string;
  readonly firstVoiceSignedMotion: number;
  readonly secondVoiceSignedMotion: number;
  readonly voiceCrossingObserved: boolean;
}>;
const inputFields = [
  {
    id: "firstVoiceMidiPair",
    label: "First voice midi pair",
    kind: "numberList",
  },
  {
    id: "secondVoiceMidiPair",
    label: "Second voice midi pair",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    input.firstVoiceMidiPair.length !== 2 ||
    input.secondVoiceMidiPair.length !== 2
  )
    simpleError("voices", "Before/after MIDI pair per voice required.");
  [...input.firstVoiceMidiPair, ...input.secondVoiceMidiPair].forEach(midi);
  const [a, b] = input.firstVoiceMidiPair,
    [c, d] = input.secondVoiceMidiPair,
    x = b - a,
    y = d - c,
    label =
      !x && !y
        ? "static"
        : !x || !y
          ? "oblique"
          : Math.sign(x) !== Math.sign(y)
            ? "contrary"
            : x === y
              ? "parallel"
              : "similar";
  return {
    twoVoiceMotionClass: label,
    firstVoiceSignedMotion: x,
    secondVoiceSignedMotion: y,
    voiceCrossingObserved: (a - c) * (b - d) < 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstVoiceMidiPair: [60, 62],
  secondVoiceMidiPair: [67, 69],
} satisfies Input;
export const exampleOutput = {
  twoVoiceMotionClass: "parallel",
  firstVoiceSignedMotion: 2,
  secondVoiceSignedMotion: 2,
  voiceCrossingObserved: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/voice-leading-motion-classifier",
  title: "Voice-Leading Motion Classifier",
  description:
    "Classify two observed voice movements by signed interval/direction, preserving static/oblique/similar/parallel and strict crossing; no counterpoint legality or voice identity inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "twoVoiceMotionClass",
      label: "Two voice motion class",
      kind: "string",
    },
    {
      id: "firstVoiceSignedMotion",
      label: "First voice signed motion",
      kind: "number",
    },
    {
      id: "secondVoiceSignedMotion",
      label: "Second voice signed motion",
      kind: "number",
    },
    {
      id: "voiceCrossingObserved",
      label: "Voice crossing observed",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      firstVoiceMidiPair: value.firstVoiceMidiPair as readonly number[],
      secondVoiceMidiPair: value.secondVoiceMidiPair as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
