import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedModernLineageKeys: readonly string[];
  readonly callerVerifiedModernLineageNotices: readonly string[];
  readonly queryModernLineageKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedModernLineageKeys",
    label: "Caller verified modern lineage keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedModernLineageNotices",
    label: "Caller verified modern lineage notices",
    kind: "stringList",
  },
  {
    id: "queryModernLineageKey",
    label: "Query modern lineage key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedModernLineageKeys,
      input.callerVerifiedModernLineageNotices,
      input.queryModernLineageKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedModernLineageKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedModernLineageNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryModernLineageKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/modern-lineage-denishawn-graham-cunningham-lookup",
  title: "Modern Lineage Denishawn Graham Cunningham Lookup",
  description:
    "Independently source-verified Denishawn/Graham/Cunningham historical lineage and method reference. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedModernLineageKeys:
        value.callerVerifiedModernLineageKeys as readonly string[],
      callerVerifiedModernLineageNotices:
        value.callerVerifiedModernLineageNotices as readonly string[],
      queryModernLineageKey: value.queryModernLineageKey as string,
    }),
});
export const run = tool.execute;
export default tool;
