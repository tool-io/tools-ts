import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sequence,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerDancerEntryOffsetCounts: readonly number[];
  readonly callerMotifDurationCounts: number;
  readonly callerAvailablePhraseCounts: number;
}>;
export type Output = Readonly<{
  readonly plannedMotifCountIntervals: readonly (readonly number[])[];
  readonly latestMotifEndCount: number;
  readonly entriesExceedingCallerPhraseIndices: readonly number[];
}>;
const inputFields = [
  {
    id: "callerDancerEntryOffsetCounts",
    label: "Caller dancer entry offset counts",
    kind: "numberList",
  },
  {
    id: "callerMotifDurationCounts",
    label: "Caller motif duration counts",
    kind: "number",
  },
  {
    id: "callerAvailablePhraseCounts",
    label: "Caller available phrase counts",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerMotifDurationCounts, "callerMotifDurationCounts");
  input.callerDancerEntryOffsetCounts.forEach((v) =>
    nonnegative(v, "callerDancerEntryOffsetCounts"),
  );
  nonnegative(input.callerAvailablePhraseCounts, "callerAvailablePhraseCounts");
  sequence(input.callerDancerEntryOffsetCounts, "entries");
  if (input.callerDancerEntryOffsetCounts.length > 128)
    simpleError("entries", "At most 128 dancer entries required.");
  const ends = input.callerDancerEntryOffsetCounts.map(
    (v) => v + input.callerMotifDurationCounts,
  );
  return {
    plannedMotifCountIntervals: ends.map((v, i) => [
      input.callerDancerEntryOffsetCounts[i],
      v,
    ]),
    latestMotifEndCount: Math.max(...ends),
    entriesExceedingCallerPhraseIndices: ends.flatMap((v, i) =>
      v > input.callerAvailablePhraseCounts ? [i] : [],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDancerEntryOffsetCounts: [0, 2, 4],
  callerMotifDurationCounts: 8,
  callerAvailablePhraseCounts: 12,
} satisfies Input;
export const exampleOutput = {
  plannedMotifCountIntervals: [
    [0, 8],
    [2, 10],
    [4, 12],
  ],
  latestMotifEndCount: 12,
  entriesExceedingCallerPhraseIndices: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/canon-offset-counts-planner",
  title: "Canon Offset Counts Planner",
  description:
    "Plan actual caller nonuniform canon entry offsets and explicit motif durations against available phrase counts; no generic equal-spacing repetitions or invented dancer-delay aesthetic.",
  inputs: inputFields,
  outputs: [
    {
      id: "plannedMotifCountIntervals",
      label: "Planned motif count intervals",
      kind: "matrix",
    },
    {
      id: "latestMotifEndCount",
      label: "Latest motif end count",
      kind: "number",
    },
    {
      id: "entriesExceedingCallerPhraseIndices",
      label: "Entries exceeding caller phrase indices",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDancerEntryOffsetCounts:
        value.callerDancerEntryOffsetCounts as readonly number[],
      callerMotifDurationCounts: value.callerMotifDurationCounts as number,
      callerAvailablePhraseCounts: value.callerAvailablePhraseCounts as number,
    }),
});
export const run = tool.execute;
export default tool;
