import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  money,
  sumMoney,
  signedSum,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerEligibleItemizedDeductionsMinor: readonly number[];
  readonly callerApplicableStandardMinor: number;
}>;
export type Output = Readonly<{
  readonly itemizedSumMinor: number;
  readonly signedItemizedAdvantageMinor: number;
  readonly largerAmount: string;
}>;
const inputFields = [
  {
    id: "callerEligibleItemizedDeductionsMinor",
    label: "Caller eligible itemized deductions minor",
    kind: "numberList",
  },
  {
    id: "callerApplicableStandardMinor",
    label: "Caller applicable standard minor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerEligibleItemizedDeductionsMinor.forEach((v) =>
    money(v, "callerEligibleItemizedDeductionsMinor"),
  );
  money(input.callerApplicableStandardMinor, "callerApplicableStandardMinor");
  const n = sumMoney(input.callerEligibleItemizedDeductionsMinor),
    d = signedSum([n, -input.callerApplicableStandardMinor]);
  return {
    itemizedSumMinor: n,
    signedItemizedAdvantageMinor: d,
    largerAmount: d > 0 ? "itemized" : d < 0 ? "standard" : "tie",
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEligibleItemizedDeductionsMinor: [30, 40],
  callerApplicableStandardMinor: 60,
} satisfies Input;
export const exampleOutput = {
  itemizedSumMinor: 70,
  signedItemizedAdvantageMinor: 10,
  largerAmount: "itemized",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/standard-vs-itemized-breakeven-compare",
  title: "Standard vs Itemized Breakeven Compare Tool",
  description:
    "Independently eligible itemized sum vs applicable standard deduction with signed difference/tie; no tax-rate optimization or allowed election. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "itemizedSumMinor", label: "Itemized sum minor", kind: "number" },
    {
      id: "signedItemizedAdvantageMinor",
      label: "Signed itemized advantage minor",
      kind: "number",
    },
    { id: "largerAmount", label: "Larger amount", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      callerEligibleItemizedDeductionsMinor:
        value.callerEligibleItemizedDeductionsMinor as readonly number[],
      callerApplicableStandardMinor:
        value.callerApplicableStandardMinor as number,
    }),
});
export const run = tool.execute;
export default tool;
