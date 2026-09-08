import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  rateMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly domesticTaxBeforeForeignReliefMinor: number;
  readonly eligibleForeignTaxMinor: number;
  readonly callerApplicableCreditLimitMinor: number;
  readonly callerMarginalDeductionBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly conditionalCreditTaxMinor: number;
  readonly conditionalDeductionTaxMinor: number;
  readonly signedCreditAdvantageMinor: number;
}>;
const inputFields = [
  {
    id: "domesticTaxBeforeForeignReliefMinor",
    label: "Domestic tax before foreign relief minor",
    kind: "number",
  },
  {
    id: "eligibleForeignTaxMinor",
    label: "Eligible foreign tax minor",
    kind: "number",
  },
  {
    id: "callerApplicableCreditLimitMinor",
    label: "Caller applicable credit limit minor",
    kind: "number",
  },
  {
    id: "callerMarginalDeductionBasisPoints",
    label: "Caller marginal deduction basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.domesticTaxBeforeForeignReliefMinor,
    "domesticTaxBeforeForeignReliefMinor",
  );
  money(input.eligibleForeignTaxMinor, "eligibleForeignTaxMinor");
  money(
    input.callerApplicableCreditLimitMinor,
    "callerApplicableCreditLimitMinor",
  );
  bounded(input.callerMarginalDeductionBasisPoints, "marginalrate", 0, 10000);
  const c = Math.min(
      input.domesticTaxBeforeForeignReliefMinor,
      input.eligibleForeignTaxMinor,
      input.callerApplicableCreditLimitMinor,
    ),
    d = Math.min(
      input.domesticTaxBeforeForeignReliefMinor,
      rateMinor(
        input.eligibleForeignTaxMinor,
        input.callerMarginalDeductionBasisPoints,
      ),
    ),
    ct = input.domesticTaxBeforeForeignReliefMinor - c,
    dt = input.domesticTaxBeforeForeignReliefMinor - d;
  return {
    conditionalCreditTaxMinor: ct,
    conditionalDeductionTaxMinor: dt,
    signedCreditAdvantageMinor: dt - ct,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  domesticTaxBeforeForeignReliefMinor: 100,
  eligibleForeignTaxMinor: 30,
  callerApplicableCreditLimitMinor: 20,
  callerMarginalDeductionBasisPoints: 5000,
} satisfies Input;
export const exampleOutput = {
  conditionalCreditTaxMinor: 80,
  conditionalDeductionTaxMinor: 85,
  signedCreditAdvantageMinor: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/foreign-tax-credit-vs-deduction-compare",
  title: "Foreign Tax Credit vs Deduction Compare Tool",
  description:
    "Compare caller independently eligible limited foreign credit vs marginal-rate deduction savings, no sourcing/basket/election eligibility or global tax optimization. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalCreditTaxMinor",
      label: "Conditional credit tax minor",
      kind: "number",
    },
    {
      id: "conditionalDeductionTaxMinor",
      label: "Conditional deduction tax minor",
      kind: "number",
    },
    {
      id: "signedCreditAdvantageMinor",
      label: "Signed credit advantage minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      domesticTaxBeforeForeignReliefMinor:
        value.domesticTaxBeforeForeignReliefMinor as number,
      eligibleForeignTaxMinor: value.eligibleForeignTaxMinor as number,
      callerApplicableCreditLimitMinor:
        value.callerApplicableCreditLimitMinor as number,
      callerMarginalDeductionBasisPoints:
        value.callerMarginalDeductionBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
