import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerNumberTalkStringsItemIds: readonly string[];
  readonly callerNumberTalkStringsTexts: readonly string[];
  readonly callerNumberTalkStringsTopicIds: readonly string[];
  readonly queryTopicId: string;
}>;
export type Output = Readonly<{
  readonly matchedItemIds: readonly string[];
  readonly matchedItemTexts: readonly string[];
}>;
const inputFields = [
  {
    id: "callerNumberTalkStringsItemIds",
    label: "Caller number talk strings item ids",
    kind: "stringList",
  },
  {
    id: "callerNumberTalkStringsTexts",
    label: "Caller number talk strings texts",
    kind: "stringList",
  },
  {
    id: "callerNumberTalkStringsTopicIds",
    label: "Caller number talk strings topic ids",
    kind: "stringList",
  },
  { id: "queryTopicId", label: "Query topic id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerNumberTalkStringsItemIds,
    input.callerNumberTalkStringsTexts,
    "callerNumberTalkStringsItemIds",
  );
  aligned(
    input.callerNumberTalkStringsItemIds,
    input.callerNumberTalkStringsTopicIds,
    "callerNumberTalkStringsItemIds",
  );
  unique(input.callerNumberTalkStringsItemIds, "bank ids");
  if (!input.callerNumberTalkStringsTopicIds.includes(input.queryTopicId))
    simpleError("query", "Exact known caller topic required.");
  return {
    matchedItemIds: input.callerNumberTalkStringsItemIds.filter(
      (_, i) => input.callerNumberTalkStringsTopicIds[i] === input.queryTopicId,
    ),
    matchedItemTexts: input.callerNumberTalkStringsTexts.filter(
      (_, i) => input.callerNumberTalkStringsTopicIds[i] === input.queryTopicId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerNumberTalkStringsItemIds: ["a", "b"],
  callerNumberTalkStringsTexts: [
    "independently approved item a",
    "independently approved item b",
  ],
  callerNumberTalkStringsTopicIds: ["topic-a", "topic-b"],
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
  id: "pedagogy/number-talks-mental-math-string-problems-sequences",
  title: "Number Talks Mental Math String Problems Sequences",
  description:
    "Query actual caller approved mental math problem string bank by concept, not generate unverified progression or require one canonical strategy. Query actual independently approved bounded material bank by exact topic; no inferred learner intent. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    { id: "matchedItemIds", label: "Matched item ids", kind: "stringList" },
    { id: "matchedItemTexts", label: "Matched item texts", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      callerNumberTalkStringsItemIds:
        value.callerNumberTalkStringsItemIds as readonly string[],
      callerNumberTalkStringsTexts:
        value.callerNumberTalkStringsTexts as readonly string[],
      callerNumberTalkStringsTopicIds:
        value.callerNumberTalkStringsTopicIds as readonly string[],
      queryTopicId: value.queryTopicId as string,
    }),
});
export const run = tool.execute;
export default tool;
