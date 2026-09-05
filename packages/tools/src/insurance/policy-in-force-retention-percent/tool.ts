import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch45-shared.js";
export type Input = Readonly<{
  readonly eligibleRenewalPolicies: number;
  readonly retainedEligiblePolicies: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "eligibleRenewalPolicies",
    label: "Eligible renewal policies",
    kind: "number",
  },
  {
    id: "retainedEligiblePolicies",
    label: "Retained eligible policies",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.eligibleRenewalPolicies, "eligible", 1, 1000000000);
  bounded(
    input.retainedEligiblePolicies,
    "retained",
    0,
    input.eligibleRenewalPolicies,
  );
  return {
    observedCohortRetentionPercent:
      (100 * input.retainedEligiblePolicies) / input.eligibleRenewalPolicies,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { eligibleRenewalPolicies: 100, retainedEligiblePolicies: 80 },
  output: { result: { observedCohortRetentionPercent: 80 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/policy-in-force-retention-percent",
  title: "Policy In Force Retention Percent Calculator",
  description:
    "Matched eligible policy-cohort renewal retention, excluding new policies and requiring caller independently reconciled transfers/cancellations; not final in-force count divided by initial count or a universal retention rate.",
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
