import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFundingStageMilestonesKeys: readonly string[];
  readonly callerVerifiedFundingStageMilestonesNotices: readonly string[];
  readonly queryFundingStageMilestonesKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedFundingStageMilestonesKeys",
    label: "Caller verified funding stage milestones keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFundingStageMilestonesNotices",
    label: "Caller verified funding stage milestones notices",
    kind: "stringList",
  },
  {
    id: "queryFundingStageMilestonesKey",
    label: "Query funding stage milestones key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedFundingStageMilestonesKeys,
      input.callerVerifiedFundingStageMilestonesNotices,
      input.queryFundingStageMilestonesKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFundingStageMilestonesKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedFundingStageMilestonesNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryFundingStageMilestonesKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/pre-seed-seed-series-a-stage-milestones-map",
  title: "Pre Seed Seed Series a Stage Milestones Map",
  description:
    "Caller independently verified financing-stage/market/year evidence requirements or notice; stage labels not universal. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedFundingStageMilestonesKeys:
        value.callerVerifiedFundingStageMilestonesKeys as readonly string[],
      callerVerifiedFundingStageMilestonesNotices:
        value.callerVerifiedFundingStageMilestonesNotices as readonly string[],
      queryFundingStageMilestonesKey:
        value.queryFundingStageMilestonesKey as string,
    }),
});
export const run = tool.execute;
export default tool;
