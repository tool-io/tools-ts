import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPunjabiDanceContextKeys: readonly string[];
  readonly callerVerifiedPunjabiDanceContextNotices: readonly string[];
  readonly queryPunjabiDanceContextKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPunjabiDanceContextKeys",
    label: "Caller verified punjabi dance context keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPunjabiDanceContextNotices",
    label: "Caller verified punjabi dance context notices",
    kind: "stringList",
  },
  {
    id: "queryPunjabiDanceContextKey",
    label: "Query punjabi dance context key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPunjabiDanceContextKeys,
      input.callerVerifiedPunjabiDanceContextNotices,
      input.queryPunjabiDanceContextKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPunjabiDanceContextKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPunjabiDanceContextNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPunjabiDanceContextKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/bhangra-gidha-punjabi-region-lookup",
  title: "Bhangra Gidha Punjabi Region Lookup",
  description:
    "Independently source/community-verified bhangra/gidha regional and performance context, not performer gender/identity inference. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedCallerNotice",
      label: "Matched caller notice",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedPunjabiDanceContextKeys:
        value.callerVerifiedPunjabiDanceContextKeys as readonly string[],
      callerVerifiedPunjabiDanceContextNotices:
        value.callerVerifiedPunjabiDanceContextNotices as readonly string[],
      queryPunjabiDanceContextKey: value.queryPunjabiDanceContextKey as string,
    }),
});
export const run = tool.execute;
export default tool;
