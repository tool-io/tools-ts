import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, aligned, unique } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerPeerLookForsItemIds: readonly string[];
  readonly callerPeerLookForsTexts: readonly string[];
  readonly callerPeerLookForsTopicIds: readonly string[];
  readonly queryTopicId: string;
}>;
export type Output = Readonly<{
  readonly matchedItemIds: readonly string[];
  readonly matchedItemTexts: readonly string[];
}>;
const inputFields = [
  {
    id: "callerPeerLookForsItemIds",
    label: "Caller peer look fors item ids",
    kind: "stringList",
  },
  {
    id: "callerPeerLookForsTexts",
    label: "Caller peer look fors texts",
    kind: "stringList",
  },
  {
    id: "callerPeerLookForsTopicIds",
    label: "Caller peer look fors topic ids",
    kind: "stringList",
  },
  { id: "queryTopicId", label: "Query topic id", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerPeerLookForsItemIds,
    input.callerPeerLookForsTexts,
    "callerPeerLookForsItemIds",
  );
  aligned(
    input.callerPeerLookForsItemIds,
    input.callerPeerLookForsTopicIds,
    "callerPeerLookForsItemIds",
  );
  unique(input.callerPeerLookForsItemIds, "bank ids");
  if (!input.callerPeerLookForsTopicIds.includes(input.queryTopicId))
    simpleError("query", "Exact known caller topic required.");
  return {
    matchedItemIds: input.callerPeerLookForsItemIds.filter(
      (_, i) => input.callerPeerLookForsTopicIds[i] === input.queryTopicId,
    ),
    matchedItemTexts: input.callerPeerLookForsTexts.filter(
      (_, i) => input.callerPeerLookForsTopicIds[i] === input.queryTopicId,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerPeerLookForsItemIds: ["a", "b"],
  callerPeerLookForsTexts: [
    "independently approved item a",
    "independently approved item b",
  ],
  callerPeerLookForsTopicIds: ["topic-a", "topic-b"],
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
  id: "pedagogy/peer-observation-non-evaluative-look-for-script",
  title: "Peer Observation Non Evaluative Look For Script",
  description:
    "Query actual caller approved non-evaluative peer-observation look-for bank, not infer classroom quality or student intent. Query actual independently approved bounded material bank by exact topic; no inferred learner intent. Caller independently verifies learner/context/evidence and reference edition; not causal learning efficacy, disability eligibility or educational certification.",
  inputs: inputFields,
  outputs: [
    { id: "matchedItemIds", label: "Matched item ids", kind: "stringList" },
    { id: "matchedItemTexts", label: "Matched item texts", kind: "stringList" },
  ],
  calculate: (value) =>
    calculate({
      callerPeerLookForsItemIds:
        value.callerPeerLookForsItemIds as readonly string[],
      callerPeerLookForsTexts:
        value.callerPeerLookForsTexts as readonly string[],
      callerPeerLookForsTopicIds:
        value.callerPeerLookForsTopicIds as readonly string[],
      queryTopicId: value.queryTopicId as string,
    }),
});
export const run = tool.execute;
export default tool;
