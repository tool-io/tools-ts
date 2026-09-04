import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedIncorporationChoiceKeys: readonly string[];
  readonly callerVerifiedIncorporationChoiceNotices: readonly string[];
  readonly queryIncorporationChoiceKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedIncorporationChoiceKeys",
    label: "Caller verified incorporation choice keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedIncorporationChoiceNotices",
    label: "Caller verified incorporation choice notices",
    kind: "stringList",
  },
  {
    id: "queryIncorporationChoiceKey",
    label: "Query incorporation choice key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedIncorporationChoiceKeys,
      input.callerVerifiedIncorporationChoiceNotices,
      input.queryIncorporationChoiceKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedIncorporationChoiceKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedIncorporationChoiceNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryIncorporationChoiceKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/delaware-c-corp-standard-choice-rationale-lookup",
  title: "Delaware C Corp Standard Choice Rationale Lookup",
  description:
    "Caller independently verified jurisdiction/entity/tax/funding incorporation rationale record, not universal Delaware recommendation. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedIncorporationChoiceKeys:
        value.callerVerifiedIncorporationChoiceKeys as readonly string[],
      callerVerifiedIncorporationChoiceNotices:
        value.callerVerifiedIncorporationChoiceNotices as readonly string[],
      queryIncorporationChoiceKey: value.queryIncorporationChoiceKey as string,
    }),
});
export const run = tool.execute;
export default tool;
