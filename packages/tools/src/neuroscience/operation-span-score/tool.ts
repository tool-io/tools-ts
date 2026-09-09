import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  binary,
  bounded,
  positive,
  sum,
  aligned,
  unique,
  simpleError,
} from "../batch47-shared.js";
export type Input = Readonly<{
  callerTrialSetIds: readonly string[];
  independentlyCodedSerialPositionRecallFlags: readonly (readonly number[])[];
  independentlyAssessedProcessingCorrectCounts: readonly number[];
  actualProcessingProblemCounts: readonly number[];
  setEvidenceKnownFlags: readonly number[];
}>;
export type Output = Readonly<{ result: Readonly<Record<string, unknown>> }>;
const fields = [
  {
    id: "callerTrialSetIds",
    label: "Actual trial set IDs",
    kind: "stringList",
  },
  {
    id: "independentlyCodedSerialPositionRecallFlags",
    label: "Independently position-scored recall flags by set",
    kind: "matrix",
  },
  {
    id: "independentlyAssessedProcessingCorrectCounts",
    label: "Actual correctly solved processing problems by set",
    kind: "numberList",
  },
  {
    id: "actualProcessingProblemCounts",
    label: "Actual processing problem counts by set",
    kind: "numberList",
  },
  {
    id: "setEvidenceKnownFlags",
    label: "Set evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  unique(input.callerTrialSetIds, "sets");
  for (const v of [
    input.independentlyCodedSerialPositionRecallFlags,
    input.independentlyAssessedProcessingCorrectCounts,
    input.actualProcessingProblemCounts,
    input.setEvidenceKnownFlags,
  ])
    aligned(input.callerTrialSetIds, v, "sets");
  binary(input.setEvidenceKnownFlags, "known");
  input.independentlyCodedSerialPositionRecallFlags.forEach((r) => {
    if (!r.length || r.length > 32)
      simpleError("recall", "Actual1–32serial positions per set.");
    binary(r, "recall");
  });
  input.actualProcessingProblemCounts.forEach((v, i) => {
    bounded(v, "actual-problems", 1, 1000000);
    bounded(
      input.independentlyAssessedProcessingCorrectCounts[i],
      "correct",
      0,
      v,
    );
  });
  const partial = sum(
      input.independentlyCodedSerialPositionRecallFlags.map((r, i) =>
        input.setEvidenceKnownFlags[i] ? sum(r) : 0,
      ),
    ),
    absolute = sum(
      input.independentlyCodedSerialPositionRecallFlags.map((r, i) =>
        input.setEvidenceKnownFlags[i] && r.every((v) => v === 1)
          ? r.length
          : 0,
      ),
    ),
    unknownIndices = input.setEvidenceKnownFlags.flatMap((v, i) =>
      v ? [] : [i],
    ),
    unknown = sum(
      unknownIndices.map(
        (i) => input.independentlyCodedSerialPositionRecallFlags[i].length,
      ),
    ),
    actual = positive(
      sum(
        input.actualProcessingProblemCounts.filter(
          (_, i) => input.setEvidenceKnownFlags[i],
        ),
      ),
      "known-processing-problems",
    ),
    correct = sum(
      input.independentlyAssessedProcessingCorrectCounts.filter(
        (_, i) => input.setEvidenceKnownFlags[i],
      ),
    );
  return finish({
    result: {
      knownPartialCreditRecallScore: partial,
      knownAbsoluteCreditRecallScore: absolute,
      maximumPossiblePartialCreditScore: partial + unknown,
      maximumPossibleAbsoluteCreditScore: absolute + unknown,
      knownProcessingAccuracyPercent: (100 * correct) / actual,
      unknownSetIds: unknownIndices.map((i) => input.callerTrialSetIds[i]),
    },
  });
};
export const example = {
  input: {
    callerTrialSetIds: ["set-a", "set-b"],
    independentlyCodedSerialPositionRecallFlags: [
      [1, 1],
      [1, 0, 1],
    ],
    independentlyAssessedProcessingCorrectCounts: [2, 2],
    actualProcessingProblemCounts: [2, 3],
    setEvidenceKnownFlags: [1, 1],
  },
  output: {
    result: {
      knownPartialCreditRecallScore: 4,
      knownAbsoluteCreditRecallScore: 2,
      maximumPossiblePartialCreditScore: 4,
      maximumPossibleAbsoluteCreditScore: 2,
      knownProcessingAccuracyPercent: 80,
      unknownSetIds: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/operation-span-score",
  title: "Operation Span Score Calculator",
  description:
    "Actual operation-span set inventory: independently serial-position-coded recall yields partial credit across correct items and absolute credit only for completely correct sets. Processing accuracy reported separately, unknown sets retain possible bounds. Protocol, item-order scoring, instrument applicability and actual task administration external; not a universal validity cutoff, maximum span, IQor clinical diagnosis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified actual recall scores and processing accuracy",
      kind: "object",
    },
  ],
  calculate: (input) => calculate(input as unknown as Input),
});
export const run = tool.execute;
export default tool;
