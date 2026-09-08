import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  money,
  signedSum,
  roundMinor,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly eligibleSecondhandSaleMinor: number;
  readonly eligiblePurchaseMinor: number;
  readonly callerVatBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly signedEligibleMarginMinor: number;
  readonly positiveMarginVatMinor: number;
}>;
const inputFields = [
  {
    id: "eligibleSecondhandSaleMinor",
    label: "Eligible secondhand sale minor",
    kind: "number",
  },
  {
    id: "eligiblePurchaseMinor",
    label: "Eligible purchase minor",
    kind: "number",
  },
  {
    id: "callerVatBasisPoints",
    label: "Caller vat basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(input.eligibleSecondhandSaleMinor, "eligibleSecondhandSaleMinor");
  money(input.eligiblePurchaseMinor, "eligiblePurchaseMinor");
  bounded(input.callerVatBasisPoints, "rate", 0, 10000);
  const m = signedSum([
    input.eligibleSecondhandSaleMinor,
    -input.eligiblePurchaseMinor,
  ]);
  return {
    signedEligibleMarginMinor: m,
    positiveMarginVatMinor: roundMinor(
      BigInt(Math.max(0, m)) * BigInt(input.callerVatBasisPoints),
      10000n + BigInt(input.callerVatBasisPoints),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eligibleSecondhandSaleMinor: 120,
  eligiblePurchaseMinor: 80,
  callerVatBasisPoints: 2000,
} satisfies Input;
export const exampleOutput = {
  signedEligibleMarginMinor: 40,
  positiveMarginVatMinor: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/margin-scheme-secondhand-vat-base",
  title: "Margin Scheme Secondhand VAT Base Calculator",
  description:
    "Eligible secondhand VAT-INCLUSIVE margin VAT=m×rate/(1+rate), signed loss retained and taxable positive margin floored; caller verifies margin-scheme eligibility. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedEligibleMarginMinor",
      label: "Signed eligible margin minor",
      kind: "number",
    },
    {
      id: "positiveMarginVatMinor",
      label: "Positive margin vat minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eligibleSecondhandSaleMinor: value.eligibleSecondhandSaleMinor as number,
      eligiblePurchaseMinor: value.eligiblePurchaseMinor as number,
      callerVatBasisPoints: value.callerVatBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
