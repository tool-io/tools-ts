import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedRsuOptionsContextKeys: readonly string[];
  readonly callerVerifiedRsuOptionsContextNotices: readonly string[];
  readonly queryRsuOptionsContextKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedRsuOptionsContextKeys",
    label: "Caller verified rsu options context keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedRsuOptionsContextNotices",
    label: "Caller verified rsu options context notices",
    kind: "stringList",
  },
  {
    id: "queryRsuOptionsContextKey",
    label: "Query rsu options context key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedRsuOptionsContextKeys,
      input.callerVerifiedRsuOptionsContextNotices,
      input.queryRsuOptionsContextKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedRsuOptionsContextKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedRsuOptionsContextNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryRsuOptionsContextKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/rsu-vs-options-private-company-context-lookup",
  title: "Rsu vs Options Private Company Context Lookup",
  description:
    "Caller independently verified private-company RSU vsoption vesting/liquidity/tax context notice. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedRsuOptionsContextKeys:
        value.callerVerifiedRsuOptionsContextKeys as readonly string[],
      callerVerifiedRsuOptionsContextNotices:
        value.callerVerifiedRsuOptionsContextNotices as readonly string[],
      queryRsuOptionsContextKey: value.queryRsuOptionsContextKey as string,
    }),
});
export const run = tool.execute;
export default tool;
