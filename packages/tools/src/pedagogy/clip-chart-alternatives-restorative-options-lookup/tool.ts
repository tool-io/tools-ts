import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerRestorativeAlternativesItemIds: readonly string[];
  readonly callerRestorativeAlternativesTexts: readonly string[];
  readonly callerRestorativeAlternativesTopicIds: readonly string[];
  readonly queryTopicId: string;
}>;
export type Output = Readonly<{
  readonly matchedItemIds: readonly string[];
  readonly matchedItemTexts: readonly string[];
}>;
const inputFields = [
  {
    id: "callerRestorativeAlternativesItemIds",
    label: "Caller restorative alternatives item ids",
    kind: "stringList",
  },
  {
    id: "callerRestorativeAlternativesTexts",
    label: "Caller restorative alternatives texts",
    kind: "stringList",
  },
  {
    id: "callerRestorativeAlternativesTopicIds",
    label: "Caller restorative alternatives topic ids",
    kind: "stringList",
  },
  { id: "queryTopicId", label: "Query topic id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerRestorativeAlternativesItemIds,
    input.callerRestorativeAlternativesTexts,
    "callerRestorativeAlternativesItemIds",
  );
  aligned(
    input.callerRestorativeAlternativesItemIds,
    input.callerRestorativeAlternativesTopicIds,
    "callerRestorativeAlternativesItemIds",
  );
  unique(input.callerRestorativeAlternativesItemIds, "bank ids");
  if (!input.callerRestorativeAlternativesTopicIds.includes(input.queryTopicId))
    simpleError("query", "Exact known caller topic required.");
  return {
    matchedItemIds: input.callerRestorativeAlternativesItemIds.filter(
      (_, i) =>
        input.callerRestorativeAlternativesTopicIds[i] === input.queryTopicId,
    ),
    matchedItemTexts: input.callerRestorativeAlternativesTexts.filter(
      (_, i) =>
        input.callerRestorativeAlternativesTopicIds[i] === input.queryTopicId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerRestorativeAlternativesItemIds: ["a", "b"],
  callerRestorativeAlternativesTexts: [
    "independently approved item a",
    "independently approved item b",
  ],
  callerRestorativeAlternativesTopicIds: ["topic-a", "topic-b"],
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
  id: "pedagogy/clip-chart-alternatives-restorative-options-lookup",
  title: "Clip Chart Alternatives Restorative Options Lookup",
  description:
    "Query the caller's independently approved bank of nonstigmatizing restorative alternatives by exact topic. Does not predict behavior, infer learner intent or establish intervention efficacy.",
  inputs: inputFields,
  outputs: [
    { id: "matchedItemIds", label: "Matched item ids", kind: "stringList" },
    { id: "matchedItemTexts", label: "Matched item texts", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      callerRestorativeAlternativesItemIds:
        value.callerRestorativeAlternativesItemIds as readonly string[],
      callerRestorativeAlternativesTexts:
        value.callerRestorativeAlternativesTexts as readonly string[],
      callerRestorativeAlternativesTopicIds:
        value.callerRestorativeAlternativesTopicIds as readonly string[],
      queryTopicId: value.queryTopicId as string,
    }),
});
export const run = tool.execute;
export default tool;
