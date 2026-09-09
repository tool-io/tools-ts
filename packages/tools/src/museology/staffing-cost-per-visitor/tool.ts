import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded, money } from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMatchedStaffingCostMinor: number;
  readonly observedVisitorCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMatchedStaffingCostMinor",
    label: "Independently matched staffing cost minor",
    kind: "number",
  },
  {
    id: "observedVisitorCount",
    label: "Observed visitor count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  money(input.independentlyMatchedStaffingCostMinor, "cost");
  bounded(input.observedVisitorCount, "visitors", 1, 1000000000);
  return {
    observedStaffingCostMinorPerVisitor:
      input.independentlyMatchedStaffingCostMinor / input.observedVisitorCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMatchedStaffingCostMinor: 1000,
    observedVisitorCount: 100,
  },
  output: { result: { observedStaffingCostMinorPerVisitor: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/staffing-cost-per-visitor",
  title: "Staffing Cost per Visitor Metric Calculator",
  description:
    "Actual matched staffing cost/visitor metric under declared ledger cost scope, not staff productivity, adequacy or staffing recommendation. Mean ratio not rounded payment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
