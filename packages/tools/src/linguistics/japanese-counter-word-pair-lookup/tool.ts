import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedJapaneseCounterKeys: readonly string[];
  readonly callerVerifiedJapaneseCounterNotices: readonly string[];
  readonly queryJapaneseCounterKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedJapaneseCounterKeys",
    label: "Caller verified japanese counter keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedJapaneseCounterNotices",
    label: "Caller verified japanese counter notices",
    kind: "stringList",
  },
  {
    id: "queryJapaneseCounterKey",
    label: "Query japanese counter key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedJapaneseCounterKeys,
      input.callerVerifiedJapaneseCounterNotices,
      input.queryJapaneseCounterKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedJapaneseCounterKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedJapaneseCounterNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryJapaneseCounterKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/japanese-counter-word-pair-lookup",
  title: "Japanese Counter Word Pair Lookup",
  description:
    "Independently verified item-class/context Japanese counter and conditioned pronunciation record. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedJapaneseCounterKeys:
        value.callerVerifiedJapaneseCounterKeys as readonly string[],
      callerVerifiedJapaneseCounterNotices:
        value.callerVerifiedJapaneseCounterNotices as readonly string[],
      queryJapaneseCounterKey: value.queryJapaneseCounterKey as string,
    }),
});
export const run = tool.execute;
export default tool;
