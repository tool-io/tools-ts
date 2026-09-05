import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAttributionAgreementKeys: readonly string[];
  readonly callerVerifiedAttributionAgreementNotices: readonly string[];
  readonly queryAttributionAgreementKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedAttributionAgreementKeys",
    label: "Caller verified attribution agreement keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAttributionAgreementNotices",
    label: "Caller verified attribution agreement notices",
    kind: "stringList",
  },
  {
    id: "queryAttributionAgreementKey",
    label: "Query attribution agreement key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedAttributionAgreementKeys,
      input.callerVerifiedAttributionAgreementNotices,
      input.queryAttributionAgreementKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAttributionAgreementKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedAttributionAgreementNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryAttributionAgreementKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/off-record-on-background-attribution-tier-lookup",
  title: "Off Record on Background Attribution Tier Lookup",
  description:
    "Caller independently agreed source/editor attribution terms (off-record/background/on-record) and exact scope; these terms have no universal retrospective interpretation. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedAttributionAgreementKeys:
        value.callerVerifiedAttributionAgreementKeys as readonly string[],
      callerVerifiedAttributionAgreementNotices:
        value.callerVerifiedAttributionAgreementNotices as readonly string[],
      queryAttributionAgreementKey:
        value.queryAttributionAgreementKey as string,
    }),
});
export const run = tool.execute;
export default tool;
