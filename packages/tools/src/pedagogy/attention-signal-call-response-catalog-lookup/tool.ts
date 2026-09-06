import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerAttentionSignalsItemIds: readonly string[];
  readonly callerAttentionSignalsTexts: readonly string[];
  readonly callerAttentionSignalsTopicIds: readonly string[];
  readonly queryTopicId: string;
}>;
export type Output = Readonly<{
  readonly matchedItemIds: readonly string[];
  readonly matchedItemTexts: readonly string[];
}>;
const inputFields = [
  {
    id: "callerAttentionSignalsItemIds",
    label: "Caller attention signals item ids",
    kind: "stringList",
  },
  {
    id: "callerAttentionSignalsTexts",
    label: "Caller attention signals texts",
    kind: "stringList",
  },
  {
    id: "callerAttentionSignalsTopicIds",
    label: "Caller attention signals topic ids",
    kind: "stringList",
  },
  { id: "queryTopicId", label: "Query topic id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerAttentionSignalsItemIds,
    input.callerAttentionSignalsTexts,
    "callerAttentionSignalsItemIds",
  );
  aligned(
    input.callerAttentionSignalsItemIds,
    input.callerAttentionSignalsTopicIds,
    "callerAttentionSignalsItemIds",
  );
  unique(input.callerAttentionSignalsItemIds, "bank ids");
  if (!input.callerAttentionSignalsTopicIds.includes(input.queryTopicId))
    simpleError("query", "Exact known caller topic required.");
  return {
    matchedItemIds: input.callerAttentionSignalsItemIds.filter(
      (_, i) => input.callerAttentionSignalsTopicIds[i] === input.queryTopicId,
    ),
    matchedItemTexts: input.callerAttentionSignalsTexts.filter(
      (_, i) => input.callerAttentionSignalsTopicIds[i] === input.queryTopicId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAttentionSignalsItemIds: ["a", "b"],
  callerAttentionSignalsTexts: [
    "independently approved item a",
    "independently approved item b",
  ],
  callerAttentionSignalsTopicIds: ["topic-a", "topic-b"],
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
  id: "pedagogy/attention-signal-call-response-catalog-lookup",
  title: "Attention Signal Call Response Catalog Lookup",
  description:
    "Query actual caller context-approved call/response signals, not assume hearing/language accessibility or compliance. Query actual independently approved bounded material bank by exact topic; no inferred learner intent. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    { id: "matchedItemIds", label: "Matched item ids", kind: "stringList" },
    { id: "matchedItemTexts", label: "Matched item texts", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      callerAttentionSignalsItemIds:
        value.callerAttentionSignalsItemIds as readonly string[],
      callerAttentionSignalsTexts:
        value.callerAttentionSignalsTexts as readonly string[],
      callerAttentionSignalsTopicIds:
        value.callerAttentionSignalsTopicIds as readonly string[],
      queryTopicId: value.queryTopicId as string,
    }),
});
export const run = tool.execute;
export default tool;
