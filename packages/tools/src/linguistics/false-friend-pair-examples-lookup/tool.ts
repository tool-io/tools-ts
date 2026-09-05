import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFalseFriendPairKeys: readonly string[];
  readonly callerVerifiedFalseFriendPairNotices: readonly string[];
  readonly queryFalseFriendPairKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedFalseFriendPairKeys",
    label: "Caller verified false friend pair keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFalseFriendPairNotices",
    label: "Caller verified false friend pair notices",
    kind: "stringList",
  },
  {
    id: "queryFalseFriendPairKey",
    label: "Query false friend pair key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedFalseFriendPairKeys,
      input.callerVerifiedFalseFriendPairNotices,
      input.queryFalseFriendPairKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFalseFriendPairKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedFalseFriendPairNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryFalseFriendPairKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/false-friend-pair-examples-lookup",
  title: "False-Friend Pair Examples Lookup",
  description:
    "Independently verified cross-language senses for false-friend pair; cognacy/translation not inferred from spelling. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedFalseFriendPairKeys:
        value.callerVerifiedFalseFriendPairKeys as readonly string[],
      callerVerifiedFalseFriendPairNotices:
        value.callerVerifiedFalseFriendPairNotices as readonly string[],
      queryFalseFriendPairKey: value.queryFalseFriendPairKey as string,
    }),
});
export const run = tool.execute;
export default tool;
