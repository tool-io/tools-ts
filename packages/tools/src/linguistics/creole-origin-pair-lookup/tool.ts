import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedCreoleOriginKeys: readonly string[];
  readonly callerVerifiedCreoleOriginNotices: readonly string[];
  readonly queryCreoleOriginKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedCreoleOriginKeys",
    label: "Caller verified creole origin keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedCreoleOriginNotices",
    label: "Caller verified creole origin notices",
    kind: "stringList",
  },
  {
    id: "queryCreoleOriginKey",
    label: "Query creole origin key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedCreoleOriginKeys,
      input.callerVerifiedCreoleOriginNotices,
      input.queryCreoleOriginKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedCreoleOriginKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedCreoleOriginNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryCreoleOriginKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/creole-origin-pair-lookup",
  title: "Creole Origin Pair Lookup",
  description:
    "Independently verified creole lexifier/substrate contact pair reference; complex/disputed origins not collapsed into proven binary ancestry. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedCreoleOriginKeys:
        value.callerVerifiedCreoleOriginKeys as readonly string[],
      callerVerifiedCreoleOriginNotices:
        value.callerVerifiedCreoleOriginNotices as readonly string[],
      queryCreoleOriginKey: value.queryCreoleOriginKey as string,
    }),
});
export const run = tool.execute;
export default tool;
