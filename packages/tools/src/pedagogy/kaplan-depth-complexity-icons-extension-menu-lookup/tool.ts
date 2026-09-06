import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerDepthComplexityItemIds: readonly string[];
  readonly callerDepthComplexityTexts: readonly string[];
  readonly callerDepthComplexityTopicIds: readonly string[];
  readonly queryTopicId: string;
}>;
export type Output = Readonly<{
  readonly matchedItemIds: readonly string[];
  readonly matchedItemTexts: readonly string[];
}>;
const inputFields = [
  {
    id: "callerDepthComplexityItemIds",
    label: "Caller depth complexity item ids",
    kind: "stringList",
  },
  {
    id: "callerDepthComplexityTexts",
    label: "Caller depth complexity texts",
    kind: "stringList",
  },
  {
    id: "callerDepthComplexityTopicIds",
    label: "Caller depth complexity topic ids",
    kind: "stringList",
  },
  { id: "queryTopicId", label: "Query topic id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerDepthComplexityItemIds,
    input.callerDepthComplexityTexts,
    "callerDepthComplexityItemIds",
  );
  aligned(
    input.callerDepthComplexityItemIds,
    input.callerDepthComplexityTopicIds,
    "callerDepthComplexityItemIds",
  );
  unique(input.callerDepthComplexityItemIds, "bank ids");
  if (!input.callerDepthComplexityTopicIds.includes(input.queryTopicId))
    simpleError("query", "Exact known caller topic required.");
  return {
    matchedItemIds: input.callerDepthComplexityItemIds.filter(
      (_, i) => input.callerDepthComplexityTopicIds[i] === input.queryTopicId,
    ),
    matchedItemTexts: input.callerDepthComplexityTexts.filter(
      (_, i) => input.callerDepthComplexityTopicIds[i] === input.queryTopicId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDepthComplexityItemIds: ["a", "b"],
  callerDepthComplexityTexts: [
    "independently approved item a",
    "independently approved item b",
  ],
  callerDepthComplexityTopicIds: ["topic-a", "topic-b"],
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
  id: "pedagogy/kaplan-depth-complexity-icons-extension-menu-lookup",
  title: "Kaplan Depth Complexity Icons Extension Menu Lookup",
  description:
    "Query caller independently verified Kaplan Depth Complexity extension bank, icons licensing/interpretation caller established. Query actual independently approved bounded material bank by exact topic; no inferred learner intent. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    { id: "matchedItemIds", label: "Matched item ids", kind: "stringList" },
    { id: "matchedItemTexts", label: "Matched item texts", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      callerDepthComplexityItemIds:
        value.callerDepthComplexityItemIds as readonly string[],
      callerDepthComplexityTexts:
        value.callerDepthComplexityTexts as readonly string[],
      callerDepthComplexityTopicIds:
        value.callerDepthComplexityTopicIds as readonly string[],
      queryTopicId: value.queryTopicId as string,
    }),
});
export const run = tool.execute;
export default tool;
