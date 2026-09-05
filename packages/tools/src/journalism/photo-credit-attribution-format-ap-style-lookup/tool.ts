import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPhotoCreditKeys: readonly string[];
  readonly callerVerifiedPhotoCreditNotices: readonly string[];
  readonly queryPhotoCreditKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPhotoCreditKeys",
    label: "Caller verified photo credit keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPhotoCreditNotices",
    label: "Caller verified photo credit notices",
    kind: "stringList",
  },
  {
    id: "queryPhotoCreditKey",
    label: "Query photo credit key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPhotoCreditKeys,
      input.callerVerifiedPhotoCreditNotices,
      input.queryPhotoCreditKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPhotoCreditKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedPhotoCreditNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPhotoCreditKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/photo-credit-attribution-format-ap-style-lookup",
  title: "Photo Credit Attribution Format AP Style Lookup",
  description:
    "Caller independently verified licensing/agency/edition photo-credit format reference, credit alone not usage permission. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedPhotoCreditKeys:
        value.callerVerifiedPhotoCreditKeys as readonly string[],
      callerVerifiedPhotoCreditNotices:
        value.callerVerifiedPhotoCreditNotices as readonly string[],
      queryPhotoCreditKey: value.queryPhotoCreditKey as string,
    }),
});
export const run = tool.execute;
export default tool;
