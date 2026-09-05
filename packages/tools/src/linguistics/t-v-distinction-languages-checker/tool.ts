import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedTvDistinctionKeys: readonly string[];
  readonly callerVerifiedTvDistinctionNotices: readonly string[];
  readonly queryTvDistinctionKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedTvDistinctionKeys",
    label: "Caller verified tv distinction keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedTvDistinctionNotices",
    label: "Caller verified tv distinction notices",
    kind: "stringList",
  },
  {
    id: "queryTvDistinctionKey",
    label: "Query tv distinction key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedTvDistinctionKeys,
      input.callerVerifiedTvDistinctionNotices,
      input.queryTvDistinctionKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedTvDistinctionKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedTvDistinctionNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryTvDistinctionKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/t-v-distinction-languages-checker",
  title: "T-V Distinction Languages Checker",
  description:
    "Caller independently documented register/person/context T–V address distinction, not universal polite-pronoun prescription. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedTvDistinctionKeys:
        value.callerVerifiedTvDistinctionKeys as readonly string[],
      callerVerifiedTvDistinctionNotices:
        value.callerVerifiedTvDistinctionNotices as readonly string[],
      queryTvDistinctionKey: value.queryTvDistinctionKey as string,
    }),
});
export const run = tool.execute;
export default tool;
