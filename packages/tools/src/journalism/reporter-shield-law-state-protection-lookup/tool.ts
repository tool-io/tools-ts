import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedShieldProtectionKeys: readonly string[];
  readonly callerVerifiedShieldProtectionNotices: readonly string[];
  readonly queryShieldProtectionKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedShieldProtectionKeys",
    label: "Caller verified shield protection keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedShieldProtectionNotices",
    label: "Caller verified shield protection notices",
    kind: "stringList",
  },
  {
    id: "queryShieldProtectionKey",
    label: "Query shield protection key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedShieldProtectionKeys,
      input.callerVerifiedShieldProtectionNotices,
      input.queryShieldProtectionKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedShieldProtectionKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedShieldProtectionNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryShieldProtectionKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/reporter-shield-law-state-protection-lookup",
  title: "Reporter Shield Law State Protection Lookup",
  description:
    "Independently verified jurisdiction/proceeding/source reporter shield scope and exceptions, not blanket protection. Exact independently verified context/edition key; not embedded or live reference data. Caller independently verifies context, evidence, reference edition and applicability; not factual authenticity, current legal advice or publication clearance.",
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
      callerVerifiedShieldProtectionKeys:
        value.callerVerifiedShieldProtectionKeys as readonly string[],
      callerVerifiedShieldProtectionNotices:
        value.callerVerifiedShieldProtectionNotices as readonly string[],
      queryShieldProtectionKey: value.queryShieldProtectionKey as string,
    }),
});
export const run = tool.execute;
export default tool;
