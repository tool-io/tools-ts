import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedCapoeiraSchoolContextKeys: readonly string[];
  readonly callerVerifiedCapoeiraSchoolContextNotices: readonly string[];
  readonly queryCapoeiraSchoolContextKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedCapoeiraSchoolContextKeys",
    label: "Caller verified capoeira school context keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedCapoeiraSchoolContextNotices",
    label: "Caller verified capoeira school context notices",
    kind: "stringList",
  },
  {
    id: "queryCapoeiraSchoolContextKey",
    label: "Query capoeira school context key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedCapoeiraSchoolContextKeys,
      input.callerVerifiedCapoeiraSchoolContextNotices,
      input.queryCapoeiraSchoolContextKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedCapoeiraSchoolContextKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedCapoeiraSchoolContextNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryCapoeiraSchoolContextKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/capoeira-angola-regional-contemporanea-lookup",
  title: "Capoeira Angola Regional Contemporanea Lookup",
  description:
    "Independently community/source-verified Angola/Regional/Contemporânea school context, no universal genealogy or safe martial movement instructions. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedCapoeiraSchoolContextKeys:
        value.callerVerifiedCapoeiraSchoolContextKeys as readonly string[],
      callerVerifiedCapoeiraSchoolContextNotices:
        value.callerVerifiedCapoeiraSchoolContextNotices as readonly string[],
      queryCapoeiraSchoolContextKey:
        value.queryCapoeiraSchoolContextKey as string,
    }),
});
export const run = tool.execute;
export default tool;
