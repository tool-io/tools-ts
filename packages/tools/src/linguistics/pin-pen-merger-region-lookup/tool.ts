import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPinPenMergerKeys: readonly string[];
  readonly callerVerifiedPinPenMergerNotices: readonly string[];
  readonly queryPinPenMergerKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPinPenMergerKeys",
    label: "Caller verified pin pen merger keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPinPenMergerNotices",
    label: "Caller verified pin pen merger notices",
    kind: "stringList",
  },
  {
    id: "queryPinPenMergerKey",
    label: "Query pin pen merger key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPinPenMergerKeys,
      input.callerVerifiedPinPenMergerNotices,
      input.queryPinPenMergerKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPinPenMergerKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPinPenMergerNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryPinPenMergerKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/pin-pen-merger-region-lookup",
  title: "Pin-Pen Merger Region Lookup",
  description:
    "Caller independently documented dialect/pre-nasal context pin–pen merger reference. Exact independently verified context/edition key, not live or embedded reference data. Caller establishes language, dialect, method and reference context; no automatic identity or universal language-wide claim.",
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
      callerVerifiedPinPenMergerKeys:
        value.callerVerifiedPinPenMergerKeys as readonly string[],
      callerVerifiedPinPenMergerNotices:
        value.callerVerifiedPinPenMergerNotices as readonly string[],
      queryPinPenMergerKey: value.queryPinPenMergerKey as string,
    }),
});
export const run = tool.execute;
export default tool;
