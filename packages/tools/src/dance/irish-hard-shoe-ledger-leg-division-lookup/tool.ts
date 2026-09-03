import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedIrishShoeStyleKeys: readonly string[];
  readonly callerVerifiedIrishShoeStyleNotices: readonly string[];
  readonly queryIrishShoeStyleKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedIrishShoeStyleKeys",
    label: "Caller verified irish shoe style keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedIrishShoeStyleNotices",
    label: "Caller verified irish shoe style notices",
    kind: "stringList",
  },
  {
    id: "queryIrishShoeStyleKey",
    label: "Query irish shoe style key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedIrishShoeStyleKeys,
      input.callerVerifiedIrishShoeStyleNotices,
      input.queryIrishShoeStyleKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedIrishShoeStyleKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedIrishShoeStyleNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryIrishShoeStyleKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/irish-hard-shoe-ledger-leg-division-lookup",
  title: "Irish Hard Shoe Ledger Leg Division Lookup",
  description:
    "Caller independently method/community-verified Irish hard-shoe/soft-shoe movement/notation reference, no technique or foot safety recommendation. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedIrishShoeStyleKeys:
        value.callerVerifiedIrishShoeStyleKeys as readonly string[],
      callerVerifiedIrishShoeStyleNotices:
        value.callerVerifiedIrishShoeStyleNotices as readonly string[],
      queryIrishShoeStyleKey: value.queryIrishShoeStyleKey as string,
    }),
});
export const run = tool.execute;
export default tool;
