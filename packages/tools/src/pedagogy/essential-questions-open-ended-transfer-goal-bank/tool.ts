import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerEssentialQuestionsItemIds: readonly string[];
  readonly callerEssentialQuestionsTexts: readonly string[];
  readonly callerEssentialQuestionsTopicIds: readonly string[];
  readonly queryTopicId: string;
}>;
export type Output = Readonly<{
  readonly matchedItemIds: readonly string[];
  readonly matchedItemTexts: readonly string[];
}>;
const inputFields = [
  {
    id: "callerEssentialQuestionsItemIds",
    label: "Caller essential questions item ids",
    kind: "stringList",
  },
  {
    id: "callerEssentialQuestionsTexts",
    label: "Caller essential questions texts",
    kind: "stringList",
  },
  {
    id: "callerEssentialQuestionsTopicIds",
    label: "Caller essential questions topic ids",
    kind: "stringList",
  },
  { id: "queryTopicId", label: "Query topic id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerEssentialQuestionsItemIds,
    input.callerEssentialQuestionsTexts,
    "callerEssentialQuestionsItemIds",
  );
  aligned(
    input.callerEssentialQuestionsItemIds,
    input.callerEssentialQuestionsTopicIds,
    "callerEssentialQuestionsItemIds",
  );
  unique(input.callerEssentialQuestionsItemIds, "bank ids");
  if (!input.callerEssentialQuestionsTopicIds.includes(input.queryTopicId))
    simpleError("query", "Exact known caller topic required.");
  return {
    matchedItemIds: input.callerEssentialQuestionsItemIds.filter(
      (_, i) =>
        input.callerEssentialQuestionsTopicIds[i] === input.queryTopicId,
    ),
    matchedItemTexts: input.callerEssentialQuestionsTexts.filter(
      (_, i) =>
        input.callerEssentialQuestionsTopicIds[i] === input.queryTopicId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEssentialQuestionsItemIds: ["a", "b"],
  callerEssentialQuestionsTexts: [
    "independently approved item a",
    "independently approved item b",
  ],
  callerEssentialQuestionsTopicIds: ["topic-a", "topic-b"],
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
  id: "pedagogy/essential-questions-open-ended-transfer-goal-bank",
  title: "Essential Questions Open Ended Transfer Goal Bank",
  description:
    "Query the caller's independently approved essential-question bank by transfer-goal topic. Preserves supplied text; does not automatically judge open-endedness, curriculum relevance or learner intent.",
  inputs: inputFields,
  outputs: [
    { id: "matchedItemIds", label: "Matched item ids", kind: "stringList" },
    { id: "matchedItemTexts", label: "Matched item texts", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      callerEssentialQuestionsItemIds:
        value.callerEssentialQuestionsItemIds as readonly string[],
      callerEssentialQuestionsTexts:
        value.callerEssentialQuestionsTexts as readonly string[],
      callerEssentialQuestionsTopicIds:
        value.callerEssentialQuestionsTopicIds as readonly string[],
      queryTopicId: value.queryTopicId as string,
    }),
});
export const run = tool.execute;
export default tool;
