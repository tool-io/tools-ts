import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedHulaContextKeys: readonly string[];
  readonly callerVerifiedHulaContextNotices: readonly string[];
  readonly queryHulaContextKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedHulaContextKeys",
    label: "Caller verified hula context keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedHulaContextNotices",
    label: "Caller verified hula context notices",
    kind: "stringList",
  },
  {
    id: "queryHulaContextKey",
    label: "Query hula context key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedHulaContextKeys,
      input.callerVerifiedHulaContextNotices,
      input.queryHulaContextKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedHulaContextKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedHulaContextNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryHulaContextKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/hula-kahiko-auana-split-lookup",
  title: "Hula Kahiko Auana Split Lookup",
  description:
    "Independently community/source-verified kahiko/ʻauana music/performance context, not rigid cultural authenticity classification. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedHulaContextKeys:
        value.callerVerifiedHulaContextKeys as readonly string[],
      callerVerifiedHulaContextNotices:
        value.callerVerifiedHulaContextNotices as readonly string[],
      queryHulaContextKey: value.queryHulaContextKey as string,
    }),
});
export const run = tool.execute;
export default tool;
