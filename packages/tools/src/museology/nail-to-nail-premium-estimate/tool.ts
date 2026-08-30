import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly insuredValuesByLeg: readonly number[];
  readonly callerAnnualPremiumFractions: readonly number[];
  readonly coveredDaysByLeg: readonly number[];
  readonly callerProrationYearDays: number;
  readonly declaredFixedPolicyFee: number;
}>;
export type Output = Readonly<{
  readonly proratedLegPremiums: readonly number[];
  readonly totalScenarioPremium: number;
}>;
const inputFields = [
  {
    id: "insuredValuesByLeg",
    label: "Insured values by leg",
    kind: "numberList",
  },
  {
    id: "callerAnnualPremiumFractions",
    label: "Caller annual premium fractions",
    kind: "numberList",
  },
  { id: "coveredDaysByLeg", label: "Covered days by leg", kind: "numberList" },
  {
    id: "callerProrationYearDays",
    label: "Caller proration year days",
    kind: "number",
  },
  {
    id: "declaredFixedPolicyFee",
    label: "Declared fixed policy fee",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerProrationYearDays, "callerProrationYearDays");
  input.insuredValuesByLeg.forEach((v) => nonnegative(v, "insuredValuesByLeg"));
  input.callerAnnualPremiumFractions.forEach((v) =>
    nonnegative(v, "callerAnnualPremiumFractions"),
  );
  input.coveredDaysByLeg.forEach((v) => nonnegative(v, "coveredDaysByLeg"));
  nonnegative(input.declaredFixedPolicyFee, "declaredFixedPolicyFee");
  aligned(
    input.insuredValuesByLeg,
    input.callerAnnualPremiumFractions,
    "insuredValuesByLeg",
  );
  aligned(
    input.insuredValuesByLeg,
    input.coveredDaysByLeg,
    "insuredValuesByLeg",
  );
  const p = input.insuredValuesByLeg.map(
    (v, i) =>
      (v * input.callerAnnualPremiumFractions[i] * input.coveredDaysByLeg[i]) /
      input.callerProrationYearDays,
  );
  return {
    proratedLegPremiums: p,
    totalScenarioPremium: sum(p) + input.declaredFixedPolicyFee,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  insuredValuesByLeg: [1000, 2000],
  callerAnnualPremiumFractions: [0.01, 0.02],
  coveredDaysByLeg: [10, 20],
  callerProrationYearDays: 365,
  declaredFixedPolicyFee: 5,
} satisfies Input;
export const exampleOutput = {
  proratedLegPremiums: [0.273972602739726, 2.191780821917808],
  totalScenarioPremium: 7.465753424657534,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/nail-to-nail-premium-estimate",
  title: "Nail-to-Nail Insurance Coverage Premium Estimate Calculator",
  description:
    "Budget explicit nail-to-nail leg values/rates/exposures with caller annual proration and fee; no underwriting, deductible/exclusion inference or binding insurance quote.",
  inputs: inputFields,
  outputs: [
    {
      id: "proratedLegPremiums",
      label: "Prorated leg premiums",
      kind: "numberList",
    },
    {
      id: "totalScenarioPremium",
      label: "Total scenario premium",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      insuredValuesByLeg: value.insuredValuesByLeg as readonly number[],
      callerAnnualPremiumFractions:
        value.callerAnnualPremiumFractions as readonly number[],
      coveredDaysByLeg: value.coveredDaysByLeg as readonly number[],
      callerProrationYearDays: value.callerProrationYearDays as number,
      declaredFixedPolicyFee: value.declaredFixedPolicyFee as number,
    }),
});
export const run = tool.execute;
export default tool;
