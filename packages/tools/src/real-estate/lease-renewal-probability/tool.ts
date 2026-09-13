import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  bounded,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualEligibleRenewedLeaseCount: number;
  readonly actualEligibleExpiringLeaseCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualEligibleRenewedLeaseCount",
    label: "Actual eligible renewed lease count",
    kind: "number",
  },
  {
    id: "actualEligibleExpiringLeaseCount",
    label: "Actual eligible expiring lease count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(
    input.actualEligibleRenewedLeaseCount,
    "actualEligibleRenewedLeaseCount",
    0,
    1000000,
  );
  bounded(
    input.actualEligibleExpiringLeaseCount,
    "actualEligibleExpiringLeaseCount",
    1,
    1000000,
  );
  if (
    input.actualEligibleRenewedLeaseCount >
    input.actualEligibleExpiringLeaseCount
  )
    simpleError("counts", "Renewed≤eligible.");
  return {
    value:
      input.actualEligibleRenewedLeaseCount /
      input.actualEligibleExpiringLeaseCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualEligibleRenewedLeaseCount: 2,
    actualEligibleExpiringLeaseCount: 4,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "real-estate/lease-renewal-probability",
  title: "Lease Renewal Probability Calculator",
  description:
    "Empirical same cohort lease-renewal fraction from actual eligible outcomes, not forecast future tenant probability. Censoring/definitions independent.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
