import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedVentureDebtKeys: readonly string[];
  readonly callerVerifiedVentureDebtNotices: readonly string[];
  readonly queryVentureDebtKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedVentureDebtKeys",
    label: "Caller verified venture debt keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedVentureDebtNotices",
    label: "Caller verified venture debt notices",
    kind: "stringList",
  },
  {
    id: "queryVentureDebtKey",
    label: "Query venture debt key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedVentureDebtKeys,
      input.callerVerifiedVentureDebtNotices,
      input.queryVentureDebtKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedVentureDebtKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedVentureDebtNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryVentureDebtKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/venture-debt-warrants-covenant-typical-terms-lookup",
  title: "Venture Debt Warrants Covenant Typical Terms Lookup",
  description:
    "Caller independently verified lender/date/contract debt covenant/warrant notice, not typical universal market terms. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedVentureDebtKeys:
        value.callerVerifiedVentureDebtKeys as readonly string[],
      callerVerifiedVentureDebtNotices:
        value.callerVerifiedVentureDebtNotices as readonly string[],
      queryVentureDebtKey: value.queryVentureDebtKey as string,
    }),
});
export const run = tool.execute;
export default tool;
