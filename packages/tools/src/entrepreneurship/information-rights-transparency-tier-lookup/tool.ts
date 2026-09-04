import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedInformationRightsKeys: readonly string[];
  readonly callerVerifiedInformationRightsNotices: readonly string[];
  readonly queryInformationRightsKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedInformationRightsKeys",
    label: "Caller verified information rights keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedInformationRightsNotices",
    label: "Caller verified information rights notices",
    kind: "stringList",
  },
  {
    id: "queryInformationRightsKey",
    label: "Query information rights key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedInformationRightsKeys,
      input.callerVerifiedInformationRightsNotices,
      input.queryInformationRightsKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedInformationRightsKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedInformationRightsNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryInformationRightsKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/information-rights-transparency-tier-lookup",
  title: "Information Rights Transparency Tier Lookup",
  description:
    "Caller independently verified investor/contract reporting rights scope/version reference. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedInformationRightsKeys:
        value.callerVerifiedInformationRightsKeys as readonly string[],
      callerVerifiedInformationRightsNotices:
        value.callerVerifiedInformationRightsNotices as readonly string[],
      queryInformationRightsKey: value.queryInformationRightsKey as string,
    }),
});
export const run = tool.execute;
export default tool;
