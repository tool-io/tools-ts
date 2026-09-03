import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedIndianClassicalStyleKeys: readonly string[];
  readonly callerVerifiedIndianClassicalStyleNotices: readonly string[];
  readonly queryIndianClassicalStyleKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedIndianClassicalStyleKeys",
    label: "Caller verified indian classical style keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedIndianClassicalStyleNotices",
    label: "Caller verified indian classical style notices",
    kind: "stringList",
  },
  {
    id: "queryIndianClassicalStyleKey",
    label: "Query indian classical style key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedIndianClassicalStyleKeys,
      input.callerVerifiedIndianClassicalStyleNotices,
      input.queryIndianClassicalStyleKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedIndianClassicalStyleKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedIndianClassicalStyleNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryIndianClassicalStyleKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/kathak-bharatanatyam-odissi-style-lookup",
  title: "Kathak Bharatanatyam Odissi Style Lookup",
  description:
    "Independently community/source-verified Kathak/Bharatanatyam/Odissi repertory context, no all-performer stereotype. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedIndianClassicalStyleKeys:
        value.callerVerifiedIndianClassicalStyleKeys as readonly string[],
      callerVerifiedIndianClassicalStyleNotices:
        value.callerVerifiedIndianClassicalStyleNotices as readonly string[],
      queryIndianClassicalStyleKey:
        value.queryIndianClassicalStyleKey as string,
    }),
});
export const run = tool.execute;
export default tool;
