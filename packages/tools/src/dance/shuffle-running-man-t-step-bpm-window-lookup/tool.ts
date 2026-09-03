import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedShuffleScoreTempo: readonly number[];
  readonly callerShuffleScoreTempoLower: readonly number[];
  readonly callerShuffleScoreTempoUpper: readonly number[];
  readonly knownShuffleScoreTempoFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedShuffleScoreTempo",
    label: "Observed shuffle score tempo",
    kind: "numberList",
  },
  {
    id: "callerShuffleScoreTempoLower",
    label: "Caller shuffle score tempo lower",
    kind: "numberList",
  },
  {
    id: "callerShuffleScoreTempoUpper",
    label: "Caller shuffle score tempo upper",
    kind: "numberList",
  },
  {
    id: "knownShuffleScoreTempoFlags",
    label: "Known shuffle score tempo flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedShuffleScoreTempo,
    input.callerShuffleScoreTempoLower,
    input.callerShuffleScoreTempoUpper,
    input.knownShuffleScoreTempoFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedShuffleScoreTempo: [2, 5],
  callerShuffleScoreTempoLower: [1, 1],
  callerShuffleScoreTempoUpper: [3, 4],
  knownShuffleScoreTempoFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  signedKnownMargins: [1, 0],
  knownReviewIndices: [],
  unknownIndices: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/shuffle-running-man-t-step-bpm-window-lookup",
  title: "Shuffle Running Man T Step Bpm Window Lookup",
  description:
    "Measured shuffle routine tempo against caller independently selected score/method bands, not automatic style recognition or universal BPM range. Missing evidence retained as explicit indices, not confirmed zero margin. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedKnownMargins",
      label: "Signed known margins",
      kind: "numberList",
    },
    {
      id: "knownReviewIndices",
      label: "Known review indices",
      kind: "numberList",
    },
    { id: "unknownIndices", label: "Unknown indices", kind: "numberList" },
  ],
  calculate: (value) =>
    calculate({
      observedShuffleScoreTempo:
        value.observedShuffleScoreTempo as readonly number[],
      callerShuffleScoreTempoLower:
        value.callerShuffleScoreTempoLower as readonly number[],
      callerShuffleScoreTempoUpper:
        value.callerShuffleScoreTempoUpper as readonly number[],
      knownShuffleScoreTempoFlags:
        value.knownShuffleScoreTempoFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
