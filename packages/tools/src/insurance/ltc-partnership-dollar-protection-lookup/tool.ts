import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  sumMoney,
  weightedMinor,
  money,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedQualifyingPartnershipBenefitsPaidMinor: readonly number[];
  readonly callerVerifiedAssetDisregardMultiplierBasisPoints: number;
  readonly callerVerifiedAssetDisregardCapMinor: number;
  readonly callerPolicyPartnershipStatusVerified: boolean;
}>;
export type Output = Readonly<{
  readonly callerModeledPartnershipAssetDisregardMinor: number;
  readonly paidBenefitAboveCallerDisregardCapMinor: number;
}>;
const inputFields = [
  {
    id: "observedQualifyingPartnershipBenefitsPaidMinor",
    label: "Observed qualifying partnership benefits paid minor",
    kind: "numberList",
  },
  {
    id: "callerVerifiedAssetDisregardMultiplierBasisPoints",
    label: "Caller verified asset disregard multiplier basis points",
    kind: "number",
  },
  {
    id: "callerVerifiedAssetDisregardCapMinor",
    label: "Caller verified asset disregard cap minor",
    kind: "number",
  },
  {
    id: "callerPolicyPartnershipStatusVerified",
    label: "Caller policy partnership status verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedQualifyingPartnershipBenefitsPaidMinor.forEach((v) => money(v));
  bounded(
    input.callerVerifiedAssetDisregardMultiplierBasisPoints,
    "multiplier",
    0,
    100000,
  );
  money(input.callerVerifiedAssetDisregardCapMinor);
  const modeled = input.callerPolicyPartnershipStatusVerified
    ? weightedMinor(
        sumMoney(input.observedQualifyingPartnershipBenefitsPaidMinor),
        input.callerVerifiedAssetDisregardMultiplierBasisPoints,
        10000,
      )
    : 0;
  return {
    callerModeledPartnershipAssetDisregardMinor: Math.min(
      modeled,
      input.callerVerifiedAssetDisregardCapMinor,
    ),
    paidBenefitAboveCallerDisregardCapMinor: Math.max(
      0,
      modeled - input.callerVerifiedAssetDisregardCapMinor,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedQualifyingPartnershipBenefitsPaidMinor: [10000, 20000],
  callerVerifiedAssetDisregardMultiplierBasisPoints: 10000,
  callerVerifiedAssetDisregardCapMinor: 25000,
  callerPolicyPartnershipStatusVerified: true,
} satisfies Input;
export const exampleOutput = {
  callerModeledPartnershipAssetDisregardMinor: 25000,
  paidBenefitAboveCallerDisregardCapMinor: 5000,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/ltc-partnership-dollar-protection-lookup",
  title: "LTC Partnership Dollar Protection Lookup",
  description:
    "Audit actual caller qualifying partnership paid ledger against explicit asset-disregard multiplier/cap and verified status; no Medicaid/state reciprocity law, eligibility or estate/tax advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerModeledPartnershipAssetDisregardMinor",
      label: "Caller modeled partnership asset disregard minor",
      kind: "number",
    },
    {
      id: "paidBenefitAboveCallerDisregardCapMinor",
      label: "Paid benefit above caller disregard cap minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedQualifyingPartnershipBenefitsPaidMinor:
        value.observedQualifyingPartnershipBenefitsPaidMinor as readonly number[],
      callerVerifiedAssetDisregardMultiplierBasisPoints:
        value.callerVerifiedAssetDisregardMultiplierBasisPoints as number,
      callerVerifiedAssetDisregardCapMinor:
        value.callerVerifiedAssetDisregardCapMinor as number,
      callerPolicyPartnershipStatusVerified:
        value.callerPolicyPartnershipStatusVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
