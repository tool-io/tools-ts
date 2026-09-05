import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedHonorificSystemKeys: readonly string[];
  readonly callerVerifiedHonorificSystemNotices: readonly string[];
  readonly queryHonorificSystemKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedHonorificSystemKeys",
    label: "Caller verified honorific system keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedHonorificSystemNotices",
    label: "Caller verified honorific system notices",
    kind: "stringList",
  },
  {
    id: "queryHonorificSystemKey",
    label: "Query honorific system key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedHonorificSystemKeys,
      input.callerVerifiedHonorificSystemNotices,
      input.queryHonorificSystemKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedHonorificSystemKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedHonorificSystemNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryHonorificSystemKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/honorifics-system-lookup-by-language",
  title: "Honorifics System By Language Lookup",
  description:
    "Independently verified language/variety/register honorific system reference. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedHonorificSystemKeys:
        value.callerVerifiedHonorificSystemKeys as readonly string[],
      callerVerifiedHonorificSystemNotices:
        value.callerVerifiedHonorificSystemNotices as readonly string[],
      queryHonorificSystemKey: value.queryHonorificSystemKey as string,
    }),
});
export const run = tool.execute;
export default tool;
