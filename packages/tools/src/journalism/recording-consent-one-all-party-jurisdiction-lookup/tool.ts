import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedRecordingConsentKeys: readonly string[];
  readonly callerVerifiedRecordingConsentNotices: readonly string[];
  readonly queryRecordingConsentKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedRecordingConsentKeys",
    label: "Caller verified recording consent keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedRecordingConsentNotices",
    label: "Caller verified recording consent notices",
    kind: "stringList",
  },
  {
    id: "queryRecordingConsentKey",
    label: "Query recording consent key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedRecordingConsentKeys,
      input.callerVerifiedRecordingConsentNotices,
      input.queryRecordingConsentKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedRecordingConsentKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedRecordingConsentNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryRecordingConsentKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/recording-consent-one-all-party-jurisdiction-lookup",
  title: "Recording Consent One All Party Jurisdiction Lookup",
  description:
    "Caller independently verified jurisdiction/date/participants/cross-border recording consent notice, no blanket current one/all-party state table. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedRecordingConsentKeys:
        value.callerVerifiedRecordingConsentKeys as readonly string[],
      callerVerifiedRecordingConsentNotices:
        value.callerVerifiedRecordingConsentNotices as readonly string[],
      queryRecordingConsentKey: value.queryRecordingConsentKey as string,
    }),
});
export const run = tool.execute;
export default tool;
