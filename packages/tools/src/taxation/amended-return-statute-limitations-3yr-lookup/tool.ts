import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAmendedReturnWindowKeys: readonly string[];
  readonly callerVerifiedAmendedReturnWindowNotices: readonly string[];
  readonly queryAmendedReturnWindowKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedAmendedReturnWindowKeys",
    label: "Caller verified amended return window keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAmendedReturnWindowNotices",
    label: "Caller verified amended return window notices",
    kind: "stringList",
  },
  {
    id: "queryAmendedReturnWindowKey",
    label: "Query amended return window key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedAmendedReturnWindowKeys,
      input.callerVerifiedAmendedReturnWindowNotices,
      input.queryAmendedReturnWindowKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAmendedReturnWindowKeys: [
    "site-a/edition-a",
    "site-a/edition-b",
  ],
  callerVerifiedAmendedReturnWindowNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryAmendedReturnWindowKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/amended-return-statute-limitations-3yr-lookup",
  title: "Amended Return Statute Limitations 3YR Lookup",
  description:
    "Caller independently verified jurisdiction/filing/payment/statute/exception amended-refund window notice;3-year title not universal cutoff. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedAmendedReturnWindowKeys:
        value.callerVerifiedAmendedReturnWindowKeys as readonly string[],
      callerVerifiedAmendedReturnWindowNotices:
        value.callerVerifiedAmendedReturnWindowNotices as readonly string[],
      queryAmendedReturnWindowKey: value.queryAmendedReturnWindowKey as string,
    }),
});
export const run = tool.execute;
export default tool;
