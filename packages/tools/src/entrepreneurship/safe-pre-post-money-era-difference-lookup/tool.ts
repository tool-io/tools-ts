import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSafeEraTermsKeys: readonly string[];
  readonly callerVerifiedSafeEraTermsNotices: readonly string[];
  readonly querySafeEraTermsKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedSafeEraTermsKeys",
    label: "Caller verified safe era terms keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSafeEraTermsNotices",
    label: "Caller verified safe era terms notices",
    kind: "stringList",
  },
  {
    id: "querySafeEraTermsKey",
    label: "Query safe era terms key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedSafeEraTermsKeys,
      input.callerVerifiedSafeEraTermsNotices,
      input.querySafeEraTermsKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedSafeEraTermsKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedSafeEraTermsNotices: [
    "independent reference a",
    "independent reference b",
  ],
  querySafeEraTermsKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/safe-pre-post-money-era-difference-lookup",
  title: "SAFE Pre-Post Money Era Difference Lookup",
  description:
    "Caller independently verified SAFE form/version pre-vs-post-money definitions, capitalization/exceptions not inferred from title. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedSafeEraTermsKeys:
        value.callerVerifiedSafeEraTermsKeys as readonly string[],
      callerVerifiedSafeEraTermsNotices:
        value.callerVerifiedSafeEraTermsNotices as readonly string[],
      querySafeEraTermsKey: value.querySafeEraTermsKey as string,
    }),
});
export const run = tool.execute;
export default tool;
