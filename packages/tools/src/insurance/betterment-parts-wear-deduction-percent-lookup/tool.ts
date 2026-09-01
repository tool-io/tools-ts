import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  binary,
  money,
  share,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedReplacementPartCostsMinor: readonly number[];
  readonly callerVerifiedWearDeductionBasisPoints: readonly number[];
  readonly callerBettermentDeductionEligibleFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerBettermentDeductionsMinor: readonly number[];
  readonly callerNetReplacementPartCostsMinor: readonly number[];
}>;
const inputFields = [
  {
    id: "observedReplacementPartCostsMinor",
    label: "Observed replacement part costs minor",
    kind: "numberList",
  },
  {
    id: "callerVerifiedWearDeductionBasisPoints",
    label: "Caller verified wear deduction basis points",
    kind: "numberList",
  },
  {
    id: "callerBettermentDeductionEligibleFlags",
    label: "Caller betterment deduction eligible flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedReplacementPartCostsMinor,
    input.callerVerifiedWearDeductionBasisPoints,
    "parts",
  );
  aligned(
    input.observedReplacementPartCostsMinor,
    input.callerBettermentDeductionEligibleFlags,
    "parts",
  );
  binary(input.callerBettermentDeductionEligibleFlags, "eligibility");
  input.observedReplacementPartCostsMinor.forEach((v) => money(v));
  input.callerVerifiedWearDeductionBasisPoints.forEach((v) =>
    bounded(v, "bps", 0, 10000),
  );
  const deductions = input.observedReplacementPartCostsMinor.map((v, i) =>
    input.callerBettermentDeductionEligibleFlags[i]
      ? share(v, input.callerVerifiedWearDeductionBasisPoints[i])
      : 0,
  );
  return {
    callerBettermentDeductionsMinor: deductions,
    callerNetReplacementPartCostsMinor:
      input.observedReplacementPartCostsMinor.map((v, i) => v - deductions[i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedReplacementPartCostsMinor: [1000, 2000],
  callerVerifiedWearDeductionBasisPoints: [1000, 5000],
  callerBettermentDeductionEligibleFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  callerBettermentDeductionsMinor: [100, 0],
  callerNetReplacementPartCostsMinor: [900, 2000],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/betterment-parts-wear-deduction-percent-lookup",
  title: "Betterment Parts Wear Deduction Percent Lookup",
  description:
    "Audit actual replacement part costs under caller verified wear deductions and independent betterment eligibility flags; no roof-age policy alias, legal deduction right or part safety rating.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerBettermentDeductionsMinor",
      label: "Caller betterment deductions minor",
      kind: "numberList",
    },
    {
      id: "callerNetReplacementPartCostsMinor",
      label: "Caller net replacement part costs minor",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedReplacementPartCostsMinor:
        value.observedReplacementPartCostsMinor as readonly number[],
      callerVerifiedWearDeductionBasisPoints:
        value.callerVerifiedWearDeductionBasisPoints as readonly number[],
      callerBettermentDeductionEligibleFlags:
        value.callerBettermentDeductionEligibleFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
