import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedJazzLineageKeys: readonly string[];
  readonly callerVerifiedJazzLineageNotices: readonly string[];
  readonly queryJazzLineageKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedJazzLineageKeys",
    label: "Caller verified jazz lineage keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedJazzLineageNotices",
    label: "Caller verified jazz lineage notices",
    kind: "stringList",
  },
  {
    id: "queryJazzLineageKey",
    label: "Query jazz lineage key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedJazzLineageKeys,
      input.callerVerifiedJazzLineageNotices,
      input.queryJazzLineageKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedJazzLineageKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedJazzLineageNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryJazzLineageKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/jazz-era-fosse-commercial-lineage-lookup",
  title: "Jazz Era Fosse Commercial Lineage Lookup",
  description:
    "Independently source-verified Fosse/commercial jazz history and style reference. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedJazzLineageKeys:
        value.callerVerifiedJazzLineageKeys as readonly string[],
      callerVerifiedJazzLineageNotices:
        value.callerVerifiedJazzLineageNotices as readonly string[],
      queryJazzLineageKey: value.queryJazzLineageKey as string,
    }),
});
export const run = tool.execute;
export default tool;
