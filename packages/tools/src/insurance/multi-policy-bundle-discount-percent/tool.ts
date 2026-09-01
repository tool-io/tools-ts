import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  sumMoney,
  money,
  share,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerSeparatePolicyAnnualPremiumMinor: readonly number[];
  readonly callerBundleDiscountBasisPoints: readonly number[];
  readonly callerBundleFixedAnnualFeeMinor: number;
}>;
export type Output = Readonly<{
  readonly roundedPolicyBundleDiscountMinor: readonly number[];
  readonly netAnnualBundleSavingMinor: number;
  readonly bundledAnnualTotalMinor: number;
}>;
const inputFields = [
  {
    id: "callerSeparatePolicyAnnualPremiumMinor",
    label: "Caller separate policy annual premium minor",
    kind: "numberList",
  },
  {
    id: "callerBundleDiscountBasisPoints",
    label: "Caller bundle discount basis points",
    kind: "numberList",
  },
  {
    id: "callerBundleFixedAnnualFeeMinor",
    label: "Caller bundle fixed annual fee minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerSeparatePolicyAnnualPremiumMinor,
    input.callerBundleDiscountBasisPoints,
    "policies",
  );
  input.callerSeparatePolicyAnnualPremiumMinor.forEach((v) => money(v));
  money(input.callerBundleFixedAnnualFeeMinor);
  const discounts = input.callerSeparatePolicyAnnualPremiumMinor.map((v, i) =>
      share(v, input.callerBundleDiscountBasisPoints[i]),
    ),
    total = sumMoney(input.callerSeparatePolicyAnnualPremiumMinor),
    discount = sumMoney(discounts);
  return {
    roundedPolicyBundleDiscountMinor: discounts,
    netAnnualBundleSavingMinor:
      discount - input.callerBundleFixedAnnualFeeMinor,
    bundledAnnualTotalMinor: sumMoney([
      total - discount,
      input.callerBundleFixedAnnualFeeMinor,
    ]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerSeparatePolicyAnnualPremiumMinor: [10000, 20000],
  callerBundleDiscountBasisPoints: [1000, 500],
  callerBundleFixedAnnualFeeMinor: 100,
} satisfies Input;
export const exampleOutput = {
  roundedPolicyBundleDiscountMinor: [1000, 1000],
  netAnnualBundleSavingMinor: 1900,
  bundledAnnualTotalMinor: 28100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/multi-policy-bundle-discount-percent",
  title: "Multi Policy Bundle Discount Percent Calculator",
  description:
    "Reconcile actual separate policy quotes, independently supplied per-policy bundle discounts and fixed fee; exact per-policy money rounding, signed savings, not universal bundle credit or coverage equivalence.",
  inputs: inputFields,
  outputs: [
    {
      id: "roundedPolicyBundleDiscountMinor",
      label: "Rounded policy bundle discount minor",
      kind: "numberList",
    },
    {
      id: "netAnnualBundleSavingMinor",
      label: "Net annual bundle saving minor",
      kind: "number",
    },
    {
      id: "bundledAnnualTotalMinor",
      label: "Bundled annual total minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerSeparatePolicyAnnualPremiumMinor:
        value.callerSeparatePolicyAnnualPremiumMinor as readonly number[],
      callerBundleDiscountBasisPoints:
        value.callerBundleDiscountBasisPoints as readonly number[],
      callerBundleFixedAnnualFeeMinor:
        value.callerBundleFixedAnnualFeeMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
