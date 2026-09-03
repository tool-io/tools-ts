import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTapPerformanceContextKeys: readonly string[];
  readonly callerVerifiedTapPerformanceContextNotices: readonly string[];
  readonly queryTapPerformanceContextKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedTapPerformanceContextKeys",
    label: "Caller verified tap performance context keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTapPerformanceContextNotices",
    label: "Caller verified tap performance context notices",
    kind: "stringList",
  },
  {
    id: "queryTapPerformanceContextKey",
    label: "Query tap performance context key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedTapPerformanceContextKeys,
      input.callerVerifiedTapPerformanceContextNotices,
      input.queryTapPerformanceContextKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTapPerformanceContextKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedTapPerformanceContextNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryTapPerformanceContextKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/tap-broadway-vs-rhythm-style-split-lookup",
  title: "Tap Broadway vs Rhythm Style Split Lookup",
  description:
    "Independently community/source-verified Broadway/rhythm tap emphasis, overlapping traditions not exclusive performer identity. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedTapPerformanceContextKeys:
        value.callerVerifiedTapPerformanceContextKeys as readonly string[],
      callerVerifiedTapPerformanceContextNotices:
        value.callerVerifiedTapPerformanceContextNotices as readonly string[],
      queryTapPerformanceContextKey:
        value.queryTapPerformanceContextKey as string,
    }),
});
export const run = tool.execute;
export default tool;
