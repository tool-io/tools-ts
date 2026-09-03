import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observedBands } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedKrumpScoreTempo: readonly number[];
  readonly callerKrumpScoreTempoLower: readonly number[];
  readonly callerKrumpScoreTempoUpper: readonly number[];
  readonly knownKrumpScoreTempoFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedKnownMargins: readonly number[];
  readonly knownReviewIndices: readonly number[];
  readonly unknownIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "observedKrumpScoreTempo",
    label: "Observed krump score tempo",
    kind: "numberList",
  },
  {
    id: "callerKrumpScoreTempoLower",
    label: "Caller krump score tempo lower",
    kind: "numberList",
  },
  {
    id: "callerKrumpScoreTempoUpper",
    label: "Caller krump score tempo upper",
    kind: "numberList",
  },
  {
    id: "knownKrumpScoreTempoFlags",
    label: "Known krump score tempo flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return observedBands(
    input.observedKrumpScoreTempo,
    input.callerKrumpScoreTempoLower,
    input.callerKrumpScoreTempoUpper,
    input.knownKrumpScoreTempoFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedKrumpScoreTempo: [2, 5],
  callerKrumpScoreTempoLower: [1, 1],
  callerKrumpScoreTempoUpper: [3, 4],
  knownKrumpScoreTempoFlags: [1, 0],
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
  id: "dance/krump-buck-hop-arm-swing-bpm-band-lookup",
  title: "Krump Buck Hop Arm Swing Bpm Band Lookup",
  description:
    "Actual explicitly notated krump routine tempo against independently documented selected-score band, not classify music by style or duplicate ballroom federation ranges. Missing evidence retained as explicit indices, not confirmed zero margin. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      observedKrumpScoreTempo:
        value.observedKrumpScoreTempo as readonly number[],
      callerKrumpScoreTempoLower:
        value.callerKrumpScoreTempoLower as readonly number[],
      callerKrumpScoreTempoUpper:
        value.callerKrumpScoreTempoUpper as readonly number[],
      knownKrumpScoreTempoFlags:
        value.knownKrumpScoreTempoFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
