import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerLanguageFramesItemIds: readonly string[];
  readonly callerLanguageFramesTexts: readonly string[];
  readonly callerLanguageFramesTopicIds: readonly string[];
  readonly queryTopicId: string;
}>;
export type Output = Readonly<{
  readonly matchedItemIds: readonly string[];
  readonly matchedItemTexts: readonly string[];
}>;
const inputFields = [
  {
    id: "callerLanguageFramesItemIds",
    label: "Caller language frames item ids",
    kind: "stringList",
  },
  {
    id: "callerLanguageFramesTexts",
    label: "Caller language frames texts",
    kind: "stringList",
  },
  {
    id: "callerLanguageFramesTopicIds",
    label: "Caller language frames topic ids",
    kind: "stringList",
  },
  { id: "queryTopicId", label: "Query topic id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerLanguageFramesItemIds,
    input.callerLanguageFramesTexts,
    "callerLanguageFramesItemIds",
  );
  aligned(
    input.callerLanguageFramesItemIds,
    input.callerLanguageFramesTopicIds,
    "callerLanguageFramesItemIds",
  );
  unique(input.callerLanguageFramesItemIds, "bank ids");
  if (!input.callerLanguageFramesTopicIds.includes(input.queryTopicId))
    simpleError("query", "Exact known caller topic required.");
  return {
    matchedItemIds: input.callerLanguageFramesItemIds.filter(
      (_, i) => input.callerLanguageFramesTopicIds[i] === input.queryTopicId,
    ),
    matchedItemTexts: input.callerLanguageFramesTexts.filter(
      (_, i) => input.callerLanguageFramesTopicIds[i] === input.queryTopicId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLanguageFramesItemIds: ["a", "b"],
  callerLanguageFramesTexts: [
    "independently approved item a",
    "independently approved item b",
  ],
  callerLanguageFramesTopicIds: ["topic-a", "topic-b"],
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
  id: "pedagogy/ell-sentence-frames-language-scaffold-bank",
  title: "ELL Sentence Frames Language Scaffold Bank",
  description:
    "Query actual caller language/task/proficiency-matched ELL sentence-frame bank, not infer learner identity or disability. Query actual independently approved bounded material bank by exact topic; no inferred learner intent. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    { id: "matchedItemIds", label: "Matched item ids", kind: "stringList" },
    { id: "matchedItemTexts", label: "Matched item texts", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      callerLanguageFramesItemIds:
        value.callerLanguageFramesItemIds as readonly string[],
      callerLanguageFramesTexts:
        value.callerLanguageFramesTexts as readonly string[],
      callerLanguageFramesTopicIds:
        value.callerLanguageFramesTopicIds as readonly string[],
      queryTopicId: value.queryTopicId as string,
    }),
});
export const run = tool.execute;
export default tool;
