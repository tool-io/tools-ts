import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedCotCaughtMergerKeys: readonly string[];
  readonly callerVerifiedCotCaughtMergerNotices: readonly string[];
  readonly queryCotCaughtMergerKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedCotCaughtMergerKeys",
    label: "Caller verified cot caught merger keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedCotCaughtMergerNotices",
    label: "Caller verified cot caught merger notices",
    kind: "stringList",
  },
  {
    id: "queryCotCaughtMergerKey",
    label: "Query cot caught merger key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedCotCaughtMergerKeys,
      input.callerVerifiedCotCaughtMergerNotices,
      input.queryCotCaughtMergerKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedCotCaughtMergerKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedCotCaughtMergerNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryCotCaughtMergerKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/cot-caught-merger-region-lookup",
  title: "Cot-Caught Merger Region Lookup",
  description:
    "Caller independently documented dialect/context cot–caught merger reference, not speaker identity inferred from geography. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedCotCaughtMergerKeys:
        value.callerVerifiedCotCaughtMergerKeys as readonly string[],
      callerVerifiedCotCaughtMergerNotices:
        value.callerVerifiedCotCaughtMergerNotices as readonly string[],
      queryCotCaughtMergerKey: value.queryCotCaughtMergerKey as string,
    }),
});
export const run = tool.execute;
export default tool;
