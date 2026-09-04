import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedManualGrowthPlaybookKeys: readonly string[];
  readonly callerVerifiedManualGrowthPlaybookNotices: readonly string[];
  readonly queryManualGrowthPlaybookKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedManualGrowthPlaybookKeys",
    label: "Caller verified manual growth playbook keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedManualGrowthPlaybookNotices",
    label: "Caller verified manual growth playbook notices",
    kind: "stringList",
  },
  {
    id: "queryManualGrowthPlaybookKey",
    label: "Query manual growth playbook key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedManualGrowthPlaybookKeys,
      input.callerVerifiedManualGrowthPlaybookNotices,
      input.queryManualGrowthPlaybookKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedManualGrowthPlaybookKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedManualGrowthPlaybookNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryManualGrowthPlaybookKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/do-things-that-dont-scale-playbook-examples-lookup",
  title: "Do Things That Dont Scale Playbook Examples Lookup",
  description:
    "Caller independently documented context-specific non-scalable operational playbook examples, no causal growth guarantee. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedManualGrowthPlaybookKeys:
        value.callerVerifiedManualGrowthPlaybookKeys as readonly string[],
      callerVerifiedManualGrowthPlaybookNotices:
        value.callerVerifiedManualGrowthPlaybookNotices as readonly string[],
      queryManualGrowthPlaybookKey:
        value.queryManualGrowthPlaybookKey as string,
    }),
});
export const run = tool.execute;
export default tool;
