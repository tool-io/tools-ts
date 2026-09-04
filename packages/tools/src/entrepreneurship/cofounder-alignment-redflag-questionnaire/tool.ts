import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  binary,
  unique,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerAlignmentTopicIds: readonly string[];
  readonly cofounderOnePositions: readonly number[];
  readonly cofounderTwoPositions: readonly number[];
  readonly callerMaxAcceptableDistances: readonly number[];
  readonly knownAlignmentFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly signedTopicDistanceReserves: readonly number[];
  readonly callerReviewTopicIds: readonly string[];
  readonly unknownTopicIds: readonly string[];
}>;
const inputFields = [
  {
    id: "callerAlignmentTopicIds",
    label: "Caller alignment topic ids",
    kind: "stringList",
  },
  {
    id: "cofounderOnePositions",
    label: "Cofounder one positions",
    kind: "numberList",
  },
  {
    id: "cofounderTwoPositions",
    label: "Cofounder two positions",
    kind: "numberList",
  },
  {
    id: "callerMaxAcceptableDistances",
    label: "Caller max acceptable distances",
    kind: "numberList",
  },
  {
    id: "knownAlignmentFlags",
    label: "Known alignment flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerMaxAcceptableDistances.forEach((v) =>
    nonnegative(v, "callerMaxAcceptableDistances"),
  );
  binary(input.knownAlignmentFlags, "knownAlignmentFlags");
  aligned(
    input.callerAlignmentTopicIds,
    input.cofounderOnePositions,
    "callerAlignmentTopicIds",
  );
  aligned(
    input.callerAlignmentTopicIds,
    input.cofounderTwoPositions,
    "callerAlignmentTopicIds",
  );
  aligned(
    input.callerAlignmentTopicIds,
    input.callerMaxAcceptableDistances,
    "callerAlignmentTopicIds",
  );
  aligned(
    input.callerAlignmentTopicIds,
    input.knownAlignmentFlags,
    "callerAlignmentTopicIds",
  );
  unique(input.callerAlignmentTopicIds, "topics");
  const d = input.cofounderOnePositions.map(
    (v, i) =>
      input.callerMaxAcceptableDistances[i] -
      Math.abs(v - input.cofounderTwoPositions[i]),
  );
  return {
    signedTopicDistanceReserves: d.map((v, i) =>
      input.knownAlignmentFlags[i] ? v : 0,
    ),
    callerReviewTopicIds: input.callerAlignmentTopicIds.filter(
      (_, i) => input.knownAlignmentFlags[i] && d[i] < 0,
    ),
    unknownTopicIds: input.callerAlignmentTopicIds.filter(
      (_, i) => !input.knownAlignmentFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAlignmentTopicIds: ["a", "b"],
  cofounderOnePositions: [1, 4],
  cofounderTwoPositions: [1, 1],
  callerMaxAcceptableDistances: [1, 2],
  knownAlignmentFlags: [1, 1],
} satisfies Input;
export const exampleOutput = {
  signedTopicDistanceReserves: [1, -1],
  callerReviewTopicIds: ["b"],
  unknownTopicIds: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/cofounder-alignment-redflag-questionnaire",
  title: "Cofounder Alignment Redflag Questionnaire",
  description:
    "Independent ordinal position-gap questionnaire under caller distance thresholds with unknown flags, not psychological/relationship diagnosis. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedTopicDistanceReserves",
      label: "Signed topic distance reserves",
      kind: "numberList",
    },
    {
      id: "callerReviewTopicIds",
      label: "Caller review topic ids",
      kind: "stringList",
    },
    { id: "unknownTopicIds", label: "Unknown topic ids", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      callerAlignmentTopicIds:
        value.callerAlignmentTopicIds as readonly string[],
      cofounderOnePositions: value.cofounderOnePositions as readonly number[],
      cofounderTwoPositions: value.cofounderTwoPositions as readonly number[],
      callerMaxAcceptableDistances:
        value.callerMaxAcceptableDistances as readonly number[],
      knownAlignmentFlags: value.knownAlignmentFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
