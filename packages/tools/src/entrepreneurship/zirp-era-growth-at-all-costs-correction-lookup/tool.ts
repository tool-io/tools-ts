import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedGrowthCostCorrectionKeys: readonly string[];
  readonly callerVerifiedGrowthCostCorrectionNotices: readonly string[];
  readonly queryGrowthCostCorrectionKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedGrowthCostCorrectionKeys",
    label: "Caller verified growth cost correction keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedGrowthCostCorrectionNotices",
    label: "Caller verified growth cost correction notices",
    kind: "stringList",
  },
  {
    id: "queryGrowthCostCorrectionKey",
    label: "Query growth cost correction key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedGrowthCostCorrectionKeys,
      input.callerVerifiedGrowthCostCorrectionNotices,
      input.queryGrowthCostCorrectionKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedGrowthCostCorrectionKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedGrowthCostCorrectionNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryGrowthCostCorrectionKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "entrepreneurship/zirp-era-growth-at-all-costs-correction-lookup",
  title: "Zirp Era Growth At All Costs Correction Lookup",
  description:
    "Caller independently documented period/company-specific growth-cost tradeoff evidence, not current market policy. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies policy, evidence, dates and applicability; not legal/compliance advice or causal business-success prediction.",
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
      callerVerifiedGrowthCostCorrectionKeys:
        value.callerVerifiedGrowthCostCorrectionKeys as readonly string[],
      callerVerifiedGrowthCostCorrectionNotices:
        value.callerVerifiedGrowthCostCorrectionNotices as readonly string[],
      queryGrowthCostCorrectionKey:
        value.queryGrowthCostCorrectionKey as string,
    }),
});
export const run = tool.execute;
export default tool;
