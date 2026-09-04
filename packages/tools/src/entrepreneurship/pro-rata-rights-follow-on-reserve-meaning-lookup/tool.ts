import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedProrataRightsKeys: readonly string[];
  readonly callerVerifiedProrataRightsNotices: readonly string[];
  readonly queryProrataRightsKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedProrataRightsKeys",
    label: "Caller verified prorata rights keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedProrataRightsNotices",
    label: "Caller verified prorata rights notices",
    kind: "stringList",
  },
  {
    id: "queryProrataRightsKey",
    label: "Query prorata rights key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedProrataRightsKeys,
      input.callerVerifiedProrataRightsNotices,
      input.queryProrataRightsKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedProrataRightsKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedProrataRightsNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryProrataRightsKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/pro-rata-rights-follow-on-reserve-meaning-lookup",
  title: "Pro Rata Rights Follow On Reserve Meaning Lookup",
  description:
    "Caller independently verified shareholder/round/contract pro-rata right and reserve scope notice. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedProrataRightsKeys:
        value.callerVerifiedProrataRightsKeys as readonly string[],
      callerVerifiedProrataRightsNotices:
        value.callerVerifiedProrataRightsNotices as readonly string[],
      queryProrataRightsKey: value.queryProrataRightsKey as string,
    }),
});
export const run = tool.execute;
export default tool;
