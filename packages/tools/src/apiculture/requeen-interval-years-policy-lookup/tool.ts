import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedRequeenPolicyKeys: readonly string[];
  readonly callerVerifiedRequeenPolicyNotices: readonly string[];
  readonly queryRequeenPolicyKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedRequeenPolicyKeys",
    label: "Caller verified requeen policy keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedRequeenPolicyNotices",
    label: "Caller verified requeen policy notices",
    kind: "stringList",
  },
  {
    id: "queryRequeenPolicyKey",
    label: "Query requeen policy key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedRequeenPolicyKeys,
      input.callerVerifiedRequeenPolicyNotices,
      input.queryRequeenPolicyKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedRequeenPolicyKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedRequeenPolicyNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryRequeenPolicyKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/requeen-interval-years-policy-lookup",
  title: "Requeen Interval Years Policy Lookup",
  description:
    "Caller independently verified management/strain/site requeen interval policy; no biological necessity inferred from queen age. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedRequeenPolicyKeys:
        value.callerVerifiedRequeenPolicyKeys as readonly string[],
      callerVerifiedRequeenPolicyNotices:
        value.callerVerifiedRequeenPolicyNotices as readonly string[],
      queryRequeenPolicyKey: value.queryRequeenPolicyKey as string,
    }),
});
export const run = tool.execute;
export default tool;
