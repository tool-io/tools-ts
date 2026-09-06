import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerFirstDayQuizItemIds: readonly string[];
  readonly callerFirstDayQuizTexts: readonly string[];
  readonly callerFirstDayQuizTopicIds: readonly string[];
  readonly queryTopicId: string;
}>;
export type Output = Readonly<{
  readonly matchedItemIds: readonly string[];
  readonly matchedItemTexts: readonly string[];
}>;
const inputFields = [
  {
    id: "callerFirstDayQuizItemIds",
    label: "Caller first day quiz item ids",
    kind: "stringList",
  },
  {
    id: "callerFirstDayQuizTexts",
    label: "Caller first day quiz texts",
    kind: "stringList",
  },
  {
    id: "callerFirstDayQuizTopicIds",
    label: "Caller first day quiz topic ids",
    kind: "stringList",
  },
  { id: "queryTopicId", label: "Query topic id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerFirstDayQuizItemIds,
    input.callerFirstDayQuizTexts,
    "callerFirstDayQuizItemIds",
  );
  aligned(
    input.callerFirstDayQuizItemIds,
    input.callerFirstDayQuizTopicIds,
    "callerFirstDayQuizItemIds",
  );
  unique(input.callerFirstDayQuizItemIds, "bank ids");
  if (!input.callerFirstDayQuizTopicIds.includes(input.queryTopicId))
    simpleError("query", "Exact known caller topic required.");
  return {
    matchedItemIds: input.callerFirstDayQuizItemIds.filter(
      (_, i) => input.callerFirstDayQuizTopicIds[i] === input.queryTopicId,
    ),
    matchedItemTexts: input.callerFirstDayQuizTexts.filter(
      (_, i) => input.callerFirstDayQuizTopicIds[i] === input.queryTopicId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFirstDayQuizItemIds: ["a", "b"],
  callerFirstDayQuizTexts: [
    "independently approved item a",
    "independently approved item b",
  ],
  callerFirstDayQuizTopicIds: ["topic-a", "topic-b"],
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
  id: "pedagogy/first-day-of-class-activity-syllabus-quiz-bank",
  title: "First Day of Class Activity Syllabus Quiz Bank",
  description:
    "Query actual caller verified syllabus/first day activity question bank by topic, no fabricated institution rules or assessment answers. Query actual independently approved bounded material bank by exact topic; no inferred learner intent. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    { id: "matchedItemIds", label: "Matched item ids", kind: "stringList" },
    { id: "matchedItemTexts", label: "Matched item texts", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      callerFirstDayQuizItemIds:
        value.callerFirstDayQuizItemIds as readonly string[],
      callerFirstDayQuizTexts:
        value.callerFirstDayQuizTexts as readonly string[],
      callerFirstDayQuizTopicIds:
        value.callerFirstDayQuizTopicIds as readonly string[],
      queryTopicId: value.queryTopicId as string,
    }),
});
export const run = tool.execute;
export default tool;
