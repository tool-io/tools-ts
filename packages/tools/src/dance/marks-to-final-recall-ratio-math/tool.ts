import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  sum,
  shape,
  unique,
  matrixFlags,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly callerCompetitorIds: readonly string[];
  readonly observedJudgeRecallFlags: readonly (readonly number[])[];
  readonly callerFinalRecallSlots: number;
}>;
export type Output = Readonly<{
  readonly recallMarksByCompetitor: readonly number[];
  readonly recallMarkFractions: readonly number[];
  readonly strictlyAboveCutoffCompetitorIds: readonly string[];
  readonly cutoffTiedCompetitorIds: readonly string[];
  readonly unambiguouslySelectedCompetitorIds: readonly string[];
  readonly cutoffMarks: number;
  readonly slotsReservedForCutoffGroup: number;
}>;
const inputFields = [
  {
    id: "callerCompetitorIds",
    label: "Caller competitor ids",
    kind: "stringList",
  },
  {
    id: "observedJudgeRecallFlags",
    label: "Observed judge recall flags",
    kind: "matrix",
  },
  {
    id: "callerFinalRecallSlots",
    label: "Caller final recall slots",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerCompetitorIds, "competitors");
  const judges = shape(input.observedJudgeRecallFlags, "marks");
  matrixFlags(input.observedJudgeRecallFlags, judges);
  aligned(
    input.callerCompetitorIds,
    input.observedJudgeRecallFlags,
    "competitors",
  );
  bounded(
    input.callerFinalRecallSlots,
    "slots",
    1,
    input.callerCompetitorIds.length,
  );
  const marks = input.observedJudgeRecallFlags.map(sum),
    sorted = [...marks].sort((a, b) => b - a),
    cutoff = sorted[input.callerFinalRecallSlots - 1],
    above = input.callerCompetitorIds.filter((_, i) => marks[i] > cutoff),
    tied = input.callerCompetitorIds.filter((_, i) => marks[i] === cutoff),
    remaining = input.callerFinalRecallSlots - above.length;
  return {
    recallMarksByCompetitor: marks,
    recallMarkFractions: marks.map((v) => v / judges),
    strictlyAboveCutoffCompetitorIds: above,
    cutoffTiedCompetitorIds: tied,
    unambiguouslySelectedCompetitorIds:
      tied.length === remaining ? [...above, ...tied] : above,
    cutoffMarks: cutoff,
    slotsReservedForCutoffGroup: remaining,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCompetitorIds: ["A", "B", "C"],
  observedJudgeRecallFlags: [
    [1, 1, 0],
    [1, 0, 0],
    [0, 0, 0],
  ],
  callerFinalRecallSlots: 1,
} satisfies Input;
export const exampleOutput = {
  recallMarksByCompetitor: [2, 1, 0],
  recallMarkFractions: [0.6666666666666666, 0.3333333333333333, 0],
  strictlyAboveCutoffCompetitorIds: [],
  cutoffTiedCompetitorIds: ["A"],
  unambiguouslySelectedCompetitorIds: ["A"],
  cutoffMarks: 2,
  slotsReservedForCutoffGroup: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/marks-to-final-recall-ratio-math",
  title: "Marks To Final Recall Ratio Math",
  description:
    "Aggregate actual judge recall ballots and final-slot cutoff with unresolved boundary ties explicitly retained; not classification recall metric, inventing adjudication tiebreaks, skating-system rank or official results.",
  inputs: inputFields,
  outputs: [
    {
      id: "recallMarksByCompetitor",
      label: "Recall marks by competitor",
      kind: "numberList",
    },
    {
      id: "recallMarkFractions",
      label: "Recall mark fractions",
      kind: "numberList",
    },
    {
      id: "strictlyAboveCutoffCompetitorIds",
      label: "Strictly above cutoff competitor ids",
      kind: "stringList",
    },
    {
      id: "cutoffTiedCompetitorIds",
      label: "Cutoff tied competitor ids",
      kind: "stringList",
    },
    {
      id: "unambiguouslySelectedCompetitorIds",
      label: "Unambiguously selected competitor ids",
      kind: "stringList",
    },
    { id: "cutoffMarks", label: "Cutoff marks", kind: "number" },
    {
      id: "slotsReservedForCutoffGroup",
      label: "Slots reserved for cutoff group",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCompetitorIds: value.callerCompetitorIds as readonly string[],
      observedJudgeRecallFlags:
        value.observedJudgeRecallFlags as readonly (readonly number[])[],
      callerFinalRecallSlots: value.callerFinalRecallSlots as number,
    }),
});
export const run = tool.execute;
export default tool;
