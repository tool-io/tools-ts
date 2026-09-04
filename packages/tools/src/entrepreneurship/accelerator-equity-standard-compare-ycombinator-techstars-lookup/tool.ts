import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAcceleratorTermsKeys: readonly string[];
  readonly callerVerifiedAcceleratorTermsNotices: readonly string[];
  readonly queryAcceleratorTermsKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedAcceleratorTermsKeys",
    label: "Caller verified accelerator terms keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAcceleratorTermsNotices",
    label: "Caller verified accelerator terms notices",
    kind: "stringList",
  },
  {
    id: "queryAcceleratorTermsKey",
    label: "Query accelerator terms key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedAcceleratorTermsKeys,
      input.callerVerifiedAcceleratorTermsNotices,
      input.queryAcceleratorTermsKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAcceleratorTermsKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedAcceleratorTermsNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryAcceleratorTermsKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/accelerator-equity-standard-compare-ycombinator-techstars-lookup",
  title: "Accelerator Equity Standard CompareY Combinator/Techstars Lookup",
  description:
    "Caller independently verified program/cohort/date accelerator equity and instrument terms; no currentYC/Techstarsdefault. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedAcceleratorTermsKeys:
        value.callerVerifiedAcceleratorTermsKeys as readonly string[],
      callerVerifiedAcceleratorTermsNotices:
        value.callerVerifiedAcceleratorTermsNotices as readonly string[],
      queryAcceleratorTermsKey: value.queryAcceleratorTermsKey as string,
    }),
});
export const run = tool.execute;
export default tool;
