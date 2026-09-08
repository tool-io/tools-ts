import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  roundMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly eligibleHomeOfficeAreaUnits: number;
  readonly callerAreaLimitUnits: number;
  readonly callerMinorRatePerAreaUnit: number;
}>;
export type Output = Readonly<{
  readonly cappedEligibleAreaUnits: number;
  readonly conditionalSimplifiedDeductionMinor: number;
}>;
const inputFields = [
  {
    id: "eligibleHomeOfficeAreaUnits",
    label: "Eligible home office area units",
    kind: "number",
  },
  {
    id: "callerAreaLimitUnits",
    label: "Caller area limit units",
    kind: "number",
  },
  {
    id: "callerMinorRatePerAreaUnit",
    label: "Caller minor rate per area unit",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.eligibleHomeOfficeAreaUnits, "area", 0, 1000000);
  bounded(input.callerAreaLimitUnits, "cap", 0, 1000000);
  money(input.callerMinorRatePerAreaUnit, "rate");
  const a = Math.min(
    input.eligibleHomeOfficeAreaUnits,
    input.callerAreaLimitUnits,
  );
  return {
    cappedEligibleAreaUnits: a,
    conditionalSimplifiedDeductionMinor: roundMinor(
      BigInt(a) * BigInt(input.callerMinorRatePerAreaUnit),
      1n,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eligibleHomeOfficeAreaUnits: 100,
  callerAreaLimitUnits: 80,
  callerMinorRatePerAreaUnit: 5,
} satisfies Input;
export const exampleOutput = {
  cappedEligibleAreaUnits: 80,
  conditionalSimplifiedDeductionMinor: 400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/home-office-simplified-square-foot-method",
  title: "Home Office Simplified Square Foot Method Calculator",
  description:
    "Simplified home-office integer area units and independently applicable per-unit minor rate/cap; area scale caller consistent, use/income eligibility not inferred. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "cappedEligibleAreaUnits",
      label: "Capped eligible area units",
      kind: "number",
    },
    {
      id: "conditionalSimplifiedDeductionMinor",
      label: "Conditional simplified deduction minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eligibleHomeOfficeAreaUnits: value.eligibleHomeOfficeAreaUnits as number,
      callerAreaLimitUnits: value.callerAreaLimitUnits as number,
      callerMinorRatePerAreaUnit: value.callerMinorRatePerAreaUnit as number,
    }),
});
export const run = tool.execute;
export default tool;
