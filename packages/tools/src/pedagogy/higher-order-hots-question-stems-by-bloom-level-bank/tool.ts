import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerHigherOrderQuestionItemIds: readonly string[];
  readonly callerHigherOrderQuestionTexts: readonly string[];
  readonly callerHigherOrderQuestionTopicIds: readonly string[];
  readonly queryTopicId: string;
}>;
export type Output = Readonly<{
  readonly matchedItemIds: readonly string[];
  readonly matchedItemTexts: readonly string[];
}>;
const inputFields = [
  {
    id: "callerHigherOrderQuestionItemIds",
    label: "Caller higher order question item ids",
    kind: "stringList",
  },
  {
    id: "callerHigherOrderQuestionTexts",
    label: "Caller higher order question texts",
    kind: "stringList",
  },
  {
    id: "callerHigherOrderQuestionTopicIds",
    label: "Caller higher order question topic ids",
    kind: "stringList",
  },
  { id: "queryTopicId", label: "Query topic id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerHigherOrderQuestionItemIds,
    input.callerHigherOrderQuestionTexts,
    "callerHigherOrderQuestionItemIds",
  );
  aligned(
    input.callerHigherOrderQuestionItemIds,
    input.callerHigherOrderQuestionTopicIds,
    "callerHigherOrderQuestionItemIds",
  );
  unique(input.callerHigherOrderQuestionItemIds, "bank ids");
  if (!input.callerHigherOrderQuestionTopicIds.includes(input.queryTopicId))
    simpleError("query", "Exact known caller topic required.");
  return {
    matchedItemIds: input.callerHigherOrderQuestionItemIds.filter(
      (_, i) =>
        input.callerHigherOrderQuestionTopicIds[i] === input.queryTopicId,
    ),
    matchedItemTexts: input.callerHigherOrderQuestionTexts.filter(
      (_, i) =>
        input.callerHigherOrderQuestionTopicIds[i] === input.queryTopicId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerHigherOrderQuestionItemIds: ["a", "b"],
  callerHigherOrderQuestionTexts: [
    "independently approved item a",
    "independently approved item b",
  ],
  callerHigherOrderQuestionTopicIds: ["topic-a", "topic-b"],
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
  id: "pedagogy/higher-order-hots-question-stems-by-bloom-level-bank",
  title: "Higher Order HOTS Question Stems By Bloom Level Bank",
  description:
    "Query independently approved context-specific higher order question bank by Bloom/topic label, not verb-only task demand classification. Query actual independently approved bounded material bank by exact topic; no inferred learner intent. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    { id: "matchedItemIds", label: "Matched item ids", kind: "stringList" },
    { id: "matchedItemTexts", label: "Matched item texts", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      callerHigherOrderQuestionItemIds:
        value.callerHigherOrderQuestionItemIds as readonly string[],
      callerHigherOrderQuestionTexts:
        value.callerHigherOrderQuestionTexts as readonly string[],
      callerHigherOrderQuestionTopicIds:
        value.callerHigherOrderQuestionTopicIds as readonly string[],
      queryTopicId: value.queryTopicId as string,
    }),
});
export const run = tool.execute;
export default tool;
