import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, ordered, sum, bounded } from "../shared.js";
export type Input = Readonly<{
  readonly ascendingOctaveStepSemitones: readonly number[];
}>;
export type Output = Readonly<{
  readonly matchesMajorPattern: boolean;
  readonly observedOctaveSpanSemitones: number;
  readonly mismatchingStepIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "ascendingOctaveStepSemitones",
    label: "Ascending octave step semitones",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.ascendingOctaveStepSemitones.length !== 7)
    simpleError(
      "steps",
      "Seven ordered scale steps including return to octave required.",
    );
  input.ascendingOctaveStepSemitones.forEach((v) => bounded(v, "step", 1, 12));
  const expected = [2, 2, 1, 2, 2, 2, 1],
    m = input.ascendingOctaveStepSemitones.flatMap((v, i) =>
      v !== expected[i] ? [i] : [],
    );
  return {
    matchesMajorPattern: m.length === 0,
    observedOctaveSpanSemitones: sum(input.ascendingOctaveStepSemitones),
    mismatchingStepIndices: m,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ascendingOctaveStepSemitones: [2, 2, 1, 2, 2, 2, 1],
} satisfies Input;
export const exampleOutput = {
  matchesMajorPattern: true,
  observedOctaveSpanSemitones: 12,
  mismatchingStepIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "music/major-scale-pattern-checker",
  title: "Major Scale Pattern Checker",
  description:
    "Audit ordered seven successive steps including octave closure against major W W H W W W H, retaining mismatch locations and actual span; no rotation inference or generated scale alias.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchesMajorPattern",
      label: "Matches major pattern",
      kind: "boolean",
    },
    {
      id: "observedOctaveSpanSemitones",
      label: "Observed octave span semitones",
      kind: "number",
    },
    {
      id: "mismatchingStepIndices",
      label: "Mismatching step indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      ascendingOctaveStepSemitones:
        value.ascendingOctaveStepSemitones as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
