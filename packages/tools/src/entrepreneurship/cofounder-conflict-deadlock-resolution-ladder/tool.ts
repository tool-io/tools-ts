import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedDeadlockLadderKeys: readonly string[];
  readonly callerVerifiedDeadlockLadderNotices: readonly string[];
  readonly queryDeadlockLadderKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedDeadlockLadderKeys",
    label: "Caller verified deadlock ladder keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedDeadlockLadderNotices",
    label: "Caller verified deadlock ladder notices",
    kind: "stringList",
  },
  {
    id: "queryDeadlockLadderKey",
    label: "Query deadlock ladder key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedDeadlockLadderKeys,
      input.callerVerifiedDeadlockLadderNotices,
      input.queryDeadlockLadderKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedDeadlockLadderKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedDeadlockLadderNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryDeadlockLadderKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/cofounder-conflict-deadlock-resolution-ladder",
  title: "Cofounder Conflict Deadlock Resolution Ladder",
  description:
    "Caller independently verified governance/contract cofounder deadlock process, no instruction to bypass legal rights. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedDeadlockLadderKeys:
        value.callerVerifiedDeadlockLadderKeys as readonly string[],
      callerVerifiedDeadlockLadderNotices:
        value.callerVerifiedDeadlockLadderNotices as readonly string[],
      queryDeadlockLadderKey: value.queryDeadlockLadderKey as string,
    }),
});
export const run = tool.execute;
export default tool;
