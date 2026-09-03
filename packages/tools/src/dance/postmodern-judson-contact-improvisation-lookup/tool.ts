import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPostmodernLineageKeys: readonly string[];
  readonly callerVerifiedPostmodernLineageNotices: readonly string[];
  readonly queryPostmodernLineageKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPostmodernLineageKeys",
    label: "Caller verified postmodern lineage keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPostmodernLineageNotices",
    label: "Caller verified postmodern lineage notices",
    kind: "stringList",
  },
  {
    id: "queryPostmodernLineageKey",
    label: "Query postmodern lineage key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPostmodernLineageKeys,
      input.callerVerifiedPostmodernLineageNotices,
      input.queryPostmodernLineageKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPostmodernLineageKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPostmodernLineageNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPostmodernLineageKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/postmodern-judson-contact-improvisation-lookup",
  title: "Postmodern Judson Contact Improvisation Lookup",
  description:
    "Independently source-verified Judson/contact improvisation historical context, not homogeneous movement identity. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedPostmodernLineageKeys:
        value.callerVerifiedPostmodernLineageKeys as readonly string[],
      callerVerifiedPostmodernLineageNotices:
        value.callerVerifiedPostmodernLineageNotices as readonly string[],
      queryPostmodernLineageKey: value.queryPostmodernLineageKey as string,
    }),
});
export const run = tool.execute;
export default tool;
