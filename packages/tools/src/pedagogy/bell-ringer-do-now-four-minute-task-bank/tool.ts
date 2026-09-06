import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerBellRingerItemIds: readonly string[];
  readonly callerBellRingerTexts: readonly string[];
  readonly callerBellRingerTopicIds: readonly string[];
  readonly queryTopicId: string;
}>;
export type Output = Readonly<{
  readonly matchedItemIds: readonly string[];
  readonly matchedItemTexts: readonly string[];
}>;
const inputFields = [
  {
    id: "callerBellRingerItemIds",
    label: "Caller bell ringer item ids",
    kind: "stringList",
  },
  {
    id: "callerBellRingerTexts",
    label: "Caller bell ringer texts",
    kind: "stringList",
  },
  {
    id: "callerBellRingerTopicIds",
    label: "Caller bell ringer topic ids",
    kind: "stringList",
  },
  { id: "queryTopicId", label: "Query topic id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerBellRingerItemIds,
    input.callerBellRingerTexts,
    "callerBellRingerItemIds",
  );
  aligned(
    input.callerBellRingerItemIds,
    input.callerBellRingerTopicIds,
    "callerBellRingerItemIds",
  );
  unique(input.callerBellRingerItemIds, "bank ids");
  if (!input.callerBellRingerTopicIds.includes(input.queryTopicId))
    simpleError("query", "Exact known caller topic required.");
  return {
    matchedItemIds: input.callerBellRingerItemIds.filter(
      (_, i) => input.callerBellRingerTopicIds[i] === input.queryTopicId,
    ),
    matchedItemTexts: input.callerBellRingerTexts.filter(
      (_, i) => input.callerBellRingerTopicIds[i] === input.queryTopicId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBellRingerItemIds: ["a", "b"],
  callerBellRingerTexts: [
    "independently approved item a",
    "independently approved item b",
  ],
  callerBellRingerTopicIds: ["topic-a", "topic-b"],
  queryTopicId: "topic-b",
} satisfies Input;
export const exampleOutput = {
  matchedItemIds: ["b"],
  matchedItemTexts: ["independently approved item b"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/bell-ringer-do-now-four-minute-task-bank",
  title: "Bell Ringer Do Now Four Minute Task Bank",
  description:
    "Query independently approved brief opening-task bank by topic; four-minute title is not universal learner work time. Query actual independently approved bounded material bank by exact topic; no inferred learner intent. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    { id: "matchedItemIds", label: "Matched item ids", kind: "stringList" },
    { id: "matchedItemTexts", label: "Matched item texts", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      callerBellRingerItemIds:
        value.callerBellRingerItemIds as readonly string[],
      callerBellRingerTexts: value.callerBellRingerTexts as readonly string[],
      callerBellRingerTopicIds:
        value.callerBellRingerTopicIds as readonly string[],
      queryTopicId: value.queryTopicId as string,
    }),
});
export const run = tool.execute;
export default tool;
