import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSambaBounceScoreKeys: readonly string[];
  readonly callerVerifiedSambaBounceScoreNotices: readonly string[];
  readonly querySambaBounceScoreKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedSambaBounceScoreKeys",
    label: "Caller verified samba bounce score keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSambaBounceScoreNotices",
    label: "Caller verified samba bounce score notices",
    kind: "stringList",
  },
  {
    id: "querySambaBounceScoreKey",
    label: "Query samba bounce score key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedSambaBounceScoreKeys,
      input.callerVerifiedSambaBounceScoreNotices,
      input.querySambaBounceScoreKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedSambaBounceScoreKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedSambaBounceScoreNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  querySambaBounceScoreKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/samba-bounce-action-per-bar-lookup",
  title: "Samba Bounce Action Per Bar Lookup",
  description:
    "Caller independently verified samba figure/method notated bounce-action score; no universal bounce count or safe execution instruction. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedSambaBounceScoreKeys:
        value.callerVerifiedSambaBounceScoreKeys as readonly string[],
      callerVerifiedSambaBounceScoreNotices:
        value.callerVerifiedSambaBounceScoreNotices as readonly string[],
      querySambaBounceScoreKey: value.querySambaBounceScoreKey as string,
    }),
});
export const run = tool.execute;
export default tool;
