import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerAnticipatoryHookItemIds: readonly string[];
  readonly callerAnticipatoryHookTexts: readonly string[];
  readonly callerAnticipatoryHookTopicIds: readonly string[];
  readonly queryTopicId: string;
}>;
export type Output = Readonly<{
  readonly matchedItemIds: readonly string[];
  readonly matchedItemTexts: readonly string[];
}>;
const inputFields = [
  {
    id: "callerAnticipatoryHookItemIds",
    label: "Caller anticipatory hook item ids",
    kind: "stringList",
  },
  {
    id: "callerAnticipatoryHookTexts",
    label: "Caller anticipatory hook texts",
    kind: "stringList",
  },
  {
    id: "callerAnticipatoryHookTopicIds",
    label: "Caller anticipatory hook topic ids",
    kind: "stringList",
  },
  { id: "queryTopicId", label: "Query topic id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerAnticipatoryHookItemIds,
    input.callerAnticipatoryHookTexts,
    "callerAnticipatoryHookItemIds",
  );
  aligned(
    input.callerAnticipatoryHookItemIds,
    input.callerAnticipatoryHookTopicIds,
    "callerAnticipatoryHookItemIds",
  );
  unique(input.callerAnticipatoryHookItemIds, "bank ids");
  if (!input.callerAnticipatoryHookTopicIds.includes(input.queryTopicId))
    simpleError("query", "Exact known caller topic required.");
  return {
    matchedItemIds: input.callerAnticipatoryHookItemIds.filter(
      (_, i) => input.callerAnticipatoryHookTopicIds[i] === input.queryTopicId,
    ),
    matchedItemTexts: input.callerAnticipatoryHookTexts.filter(
      (_, i) => input.callerAnticipatoryHookTopicIds[i] === input.queryTopicId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAnticipatoryHookItemIds: ["a", "b"],
  callerAnticipatoryHookTexts: [
    "independently approved item a",
    "independently approved item b",
  ],
  callerAnticipatoryHookTopicIds: ["topic-a", "topic-b"],
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
  id: "pedagogy/anticipatory-set-hook-strategy-catalog-lookup",
  title: "Anticipatory Set Hook Strategy Catalog Lookup",
  description:
    "Query actual caller context-approved anticipatory set hook strategies, not invented student attention or universal best hook. Query actual independently approved bounded material bank by exact topic; no inferred learner intent. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    { id: "matchedItemIds", label: "Matched item ids", kind: "stringList" },
    { id: "matchedItemTexts", label: "Matched item texts", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      callerAnticipatoryHookItemIds:
        value.callerAnticipatoryHookItemIds as readonly string[],
      callerAnticipatoryHookTexts:
        value.callerAnticipatoryHookTexts as readonly string[],
      callerAnticipatoryHookTopicIds:
        value.callerAnticipatoryHookTopicIds as readonly string[],
      queryTopicId: value.queryTopicId as string,
    }),
});
export const run = tool.execute;
export default tool;
