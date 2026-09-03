import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedLockingScoreKeys: readonly string[];
  readonly callerVerifiedLockingScoreNotices: readonly string[];
  readonly queryLockingScoreKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedLockingScoreKeys",
    label: "Caller verified locking score keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedLockingScoreNotices",
    label: "Caller verified locking score notices",
    kind: "stringList",
  },
  {
    id: "queryLockingScoreKey",
    label: "Query locking score key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedLockingScoreKeys,
      input.callerVerifiedLockingScoreNotices,
      input.queryLockingScoreKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedLockingScoreKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedLockingScoreNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryLockingScoreKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/locking-lock-up-down-groove-count-lookup",
  title: "Locking Lock Up Down Groove Count Lookup",
  description:
    "Caller independently documented locking groove/lock-up/down count score for selected routine, not universal accents or style identity. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedLockingScoreKeys:
        value.callerVerifiedLockingScoreKeys as readonly string[],
      callerVerifiedLockingScoreNotices:
        value.callerVerifiedLockingScoreNotices as readonly string[],
      queryLockingScoreKey: value.queryLockingScoreKey as string,
    }),
});
export const run = tool.execute;
export default tool;
