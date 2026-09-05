import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedExtinctionCaseKeys: readonly string[];
  readonly callerVerifiedExtinctionCaseNotices: readonly string[];
  readonly queryExtinctionCaseKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedExtinctionCaseKeys",
    label: "Caller verified extinction case keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedExtinctionCaseNotices",
    label: "Caller verified extinction case notices",
    kind: "stringList",
  },
  {
    id: "queryExtinctionCaseKey",
    label: "Query extinction case key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedExtinctionCaseKeys,
      input.callerVerifiedExtinctionCaseNotices,
      input.queryExtinctionCaseKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedExtinctionCaseKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedExtinctionCaseNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryExtinctionCaseKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/extinct-language-year-famous-lookup",
  title: "Extinct Language Year Famous Cases Lookup",
  description:
    "Independently verified language/dialect/source last-speaker or documentation event, not universal year of linguistic extinction. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedExtinctionCaseKeys:
        value.callerVerifiedExtinctionCaseKeys as readonly string[],
      callerVerifiedExtinctionCaseNotices:
        value.callerVerifiedExtinctionCaseNotices as readonly string[],
      queryExtinctionCaseKey: value.queryExtinctionCaseKey as string,
    }),
});
export const run = tool.execute;
export default tool;
