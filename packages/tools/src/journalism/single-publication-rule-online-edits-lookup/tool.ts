import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPublicationRuleKeys: readonly string[];
  readonly callerVerifiedPublicationRuleNotices: readonly string[];
  readonly queryPublicationRuleKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPublicationRuleKeys",
    label: "Caller verified publication rule keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPublicationRuleNotices",
    label: "Caller verified publication rule notices",
    kind: "stringList",
  },
  {
    id: "queryPublicationRuleKey",
    label: "Query publication rule key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPublicationRuleKeys,
      input.callerVerifiedPublicationRuleNotices,
      input.queryPublicationRuleKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPublicationRuleKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPublicationRuleNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPublicationRuleKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/single-publication-rule-online-edits-lookup",
  title: "Single Publication Rule Online Edits Lookup",
  description:
    "Independently verified jurisdiction/date substantive-edit/republication legal notice, not automatic reset of online limitations period. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedPublicationRuleKeys:
        value.callerVerifiedPublicationRuleKeys as readonly string[],
      callerVerifiedPublicationRuleNotices:
        value.callerVerifiedPublicationRuleNotices as readonly string[],
      queryPublicationRuleKey: value.queryPublicationRuleKey as string,
    }),
});
export const run = tool.execute;
export default tool;
