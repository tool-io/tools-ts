import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedQuestionIds: readonly string[];
  readonly callerQuestionTexts: readonly string[];
  readonly callerQuestionTopicIds: readonly string[];
  readonly queryTopicId: string;
}>;
export type Output = Readonly<{
  readonly matchedQuestionIds: readonly string[];
  readonly matchedQuestionTexts: readonly string[];
}>;
const inputFields = [
  {
    id: "callerVerifiedQuestionIds",
    label: "Caller verified question ids",
    kind: "stringList",
  },
  {
    id: "callerQuestionTexts",
    label: "Caller question texts",
    kind: "stringList",
  },
  {
    id: "callerQuestionTopicIds",
    label: "Caller question topic ids",
    kind: "stringList",
  },
  { id: "queryTopicId", label: "Query topic id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerVerifiedQuestionIds,
    input.callerQuestionTexts,
    "callerVerifiedQuestionIds",
  );
  aligned(
    input.callerVerifiedQuestionIds,
    input.callerQuestionTopicIds,
    "callerVerifiedQuestionIds",
  );
  unique(input.callerVerifiedQuestionIds, "question ids");
  if (!input.callerQuestionTopicIds.includes(input.queryTopicId))
    simpleError("topic", "Unknown caller bank topic.");
  return {
    matchedQuestionIds: input.callerVerifiedQuestionIds.filter(
      (_, i) => input.callerQuestionTopicIds[i] === input.queryTopicId,
    ),
    matchedQuestionTexts: input.callerQuestionTexts.filter(
      (_, i) => input.callerQuestionTopicIds[i] === input.queryTopicId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedQuestionIds: ["a", "b"],
  callerQuestionTexts: [
    "Describe the last time this happened.",
    "What workaround did you use?",
  ],
  callerQuestionTopicIds: ["incident", "workaround"],
  queryTopicId: "workaround",
} satisfies Input;
export const exampleOutput = {
  matchedQuestionIds: ["b"],
  matchedQuestionTexts: ["What workaround did you use?"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/problem-interview-discovery-question-bank",
  title: "Problem Interview Discovery Question Bank",
  description:
    "Query actual bounded independently approved discovery-question bank by exact topic, preserving supplied text instead of inventing interview claims. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedQuestionIds",
      label: "Matched question ids",
      kind: "stringList",
    },
    {
      id: "matchedQuestionTexts",
      label: "Matched question texts",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedQuestionIds:
        value.callerVerifiedQuestionIds as readonly string[],
      callerQuestionTexts: value.callerQuestionTexts as readonly string[],
      callerQuestionTopicIds: value.callerQuestionTopicIds as readonly string[],
      queryTopicId: value.queryTopicId as string,
    }),
});
export const run = tool.execute;
export default tool;
