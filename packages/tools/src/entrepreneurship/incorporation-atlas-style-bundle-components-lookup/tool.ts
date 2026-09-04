import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedIncorporationBundleKeys: readonly string[];
  readonly callerVerifiedIncorporationBundleNotices: readonly string[];
  readonly queryIncorporationBundleKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedIncorporationBundleKeys",
    label: "Caller verified incorporation bundle keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedIncorporationBundleNotices",
    label: "Caller verified incorporation bundle notices",
    kind: "stringList",
  },
  {
    id: "queryIncorporationBundleKey",
    label: "Query incorporation bundle key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedIncorporationBundleKeys,
      input.callerVerifiedIncorporationBundleNotices,
      input.queryIncorporationBundleKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedIncorporationBundleKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedIncorporationBundleNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryIncorporationBundleKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/incorporation-atlas-style-bundle-components-lookup",
  title: "Incorporation Atlas Style Bundle Components Lookup",
  description:
    "Caller independently verified provider/date/contract incorporation bundle inclusions; no live vendor service claims. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedIncorporationBundleKeys:
        value.callerVerifiedIncorporationBundleKeys as readonly string[],
      callerVerifiedIncorporationBundleNotices:
        value.callerVerifiedIncorporationBundleNotices as readonly string[],
      queryIncorporationBundleKey: value.queryIncorporationBundleKey as string,
    }),
});
export const run = tool.execute;
export default tool;
