import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPortugueseVarietySplitKeys: readonly string[];
  readonly callerVerifiedPortugueseVarietySplitNotices: readonly string[];
  readonly queryPortugueseVarietySplitKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPortugueseVarietySplitKeys",
    label: "Caller verified portuguese variety split keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPortugueseVarietySplitNotices",
    label: "Caller verified portuguese variety split notices",
    kind: "stringList",
  },
  {
    id: "queryPortugueseVarietySplitKey",
    label: "Query portuguese variety split key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPortugueseVarietySplitKeys,
      input.callerVerifiedPortugueseVarietySplitNotices,
      input.queryPortugueseVarietySplitKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPortugueseVarietySplitKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPortugueseVarietySplitNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryPortugueseVarietySplitKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/brazilian-vs-european-portuguese-split",
  title: "Brazilian vs European Portuguese Split",
  description:
    "Independently verified Brazilian/EuropeanPortuguese variety/context contrast, no all-speaker generalization. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedPortugueseVarietySplitKeys:
        value.callerVerifiedPortugueseVarietySplitKeys as readonly string[],
      callerVerifiedPortugueseVarietySplitNotices:
        value.callerVerifiedPortugueseVarietySplitNotices as readonly string[],
      queryPortugueseVarietySplitKey:
        value.queryPortugueseVarietySplitKey as string,
    }),
});
export const run = tool.execute;
export default tool;
