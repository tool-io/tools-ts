import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedDragTagRightsKeys: readonly string[];
  readonly callerVerifiedDragTagRightsNotices: readonly string[];
  readonly queryDragTagRightsKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedDragTagRightsKeys",
    label: "Caller verified drag tag rights keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedDragTagRightsNotices",
    label: "Caller verified drag tag rights notices",
    kind: "stringList",
  },
  {
    id: "queryDragTagRightsKey",
    label: "Query drag tag rights key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedDragTagRightsKeys,
      input.callerVerifiedDragTagRightsNotices,
      input.queryDragTagRightsKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedDragTagRightsKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedDragTagRightsNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryDragTagRightsKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/drag-along-tag-along-rights-meaning-lookup",
  title: "Drag Along Tag Along Rights Meaning Lookup",
  description:
    "Caller independently verified drag/tag voting, sale and participation contract notice, not automatic control right. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedDragTagRightsKeys:
        value.callerVerifiedDragTagRightsKeys as readonly string[],
      callerVerifiedDragTagRightsNotices:
        value.callerVerifiedDragTagRightsNotices as readonly string[],
      queryDragTagRightsKey: value.queryDragTagRightsKey as string,
    }),
});
export const run = tool.execute;
export default tool;
