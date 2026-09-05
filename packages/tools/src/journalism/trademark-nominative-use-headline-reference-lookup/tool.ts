import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedNominativeTrademarkKeys: readonly string[];
  readonly callerVerifiedNominativeTrademarkNotices: readonly string[];
  readonly queryNominativeTrademarkKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedNominativeTrademarkKeys",
    label: "Caller verified nominative trademark keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedNominativeTrademarkNotices",
    label: "Caller verified nominative trademark notices",
    kind: "stringList",
  },
  {
    id: "queryNominativeTrademarkKey",
    label: "Query nominative trademark key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedNominativeTrademarkKeys,
      input.callerVerifiedNominativeTrademarkNotices,
      input.queryNominativeTrademarkKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedNominativeTrademarkKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedNominativeTrademarkNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryNominativeTrademarkKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/trademark-nominative-use-headline-reference-lookup",
  title: "Trademark Nominative Use Headline Reference Lookup",
  description:
    "Independently verified jurisdiction/context nominative trademark use review notice, not legal permission from mentioning a brand. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedNominativeTrademarkKeys:
        value.callerVerifiedNominativeTrademarkKeys as readonly string[],
      callerVerifiedNominativeTrademarkNotices:
        value.callerVerifiedNominativeTrademarkNotices as readonly string[],
      queryNominativeTrademarkKey: value.queryNominativeTrademarkKey as string,
    }),
});
export const run = tool.execute;
export default tool;
