import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedVoseoRegionKeys: readonly string[];
  readonly callerVerifiedVoseoRegionNotices: readonly string[];
  readonly queryVoseoRegionKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedVoseoRegionKeys",
    label: "Caller verified voseo region keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedVoseoRegionNotices",
    label: "Caller verified voseo region notices",
    kind: "stringList",
  },
  {
    id: "queryVoseoRegionKey",
    label: "Query voseo region key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedVoseoRegionKeys,
      input.callerVerifiedVoseoRegionNotices,
      input.queryVoseoRegionKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedVoseoRegionKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedVoseoRegionNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryVoseoRegionKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/vos-replacement-region-lookup",
  title: "Voseo Region Lookup",
  description:
    "Independently verified region/register/context voseo use record, not geographic guarantee. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedVoseoRegionKeys:
        value.callerVerifiedVoseoRegionKeys as readonly string[],
      callerVerifiedVoseoRegionNotices:
        value.callerVerifiedVoseoRegionNotices as readonly string[],
      queryVoseoRegionKey: value.queryVoseoRegionKey as string,
    }),
});
export const run = tool.execute;
export default tool;
