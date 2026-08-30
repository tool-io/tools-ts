import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
  maximum,
} from "../shared.js";
export type Input = Readonly<{
  readonly candidateRotationYears: readonly number[];
  readonly netHarvestRevenues: readonly number[];
  readonly establishmentCost: number;
  readonly annualHoldingCost: number;
  readonly annualDiscountRate: number;
}>;
export type Output = Readonly<{
  readonly landExpectationValues: readonly number[];
  readonly bestCandidateRotationYears: number;
  readonly bestCandidateLandExpectationValue: number;
}>;
const inputFields = [
  {
    id: "candidateRotationYears",
    label: "Candidate rotation years",
    kind: "numberList",
  },
  {
    id: "netHarvestRevenues",
    label: "Net harvest revenues",
    kind: "numberList",
  },
  { id: "establishmentCost", label: "Establishment cost", kind: "number" },
  { id: "annualHoldingCost", label: "Annual holding cost", kind: "number" },
  { id: "annualDiscountRate", label: "Annual discount rate", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.candidateRotationYears.forEach((v) =>
    positive(v, "candidateRotationYears"),
  );
  positive(input.annualDiscountRate, "annualDiscountRate");
  nonnegative(input.establishmentCost, "establishmentCost");
  nonnegative(input.annualHoldingCost, "annualHoldingCost");
  aligned(
    input.candidateRotationYears,
    input.netHarvestRevenues,
    "candidateRotationYears",
  );
  ordered(input.candidateRotationYears, "candidateRotationYears");
  const r = input.annualDiscountRate,
    landExpectationValues = input.candidateRotationYears.map((t, i) => {
      const x = t * Math.log1p(r),
        den = -Math.expm1(-x),
        discount = Math.exp(-x);
      return (
        (input.netHarvestRevenues[i] * discount - input.establishmentCost) /
          den -
        input.annualHoldingCost / r
      );
    });
  const best = landExpectationValues.indexOf(maximum(landExpectationValues));
  return {
    landExpectationValues,
    bestCandidateRotationYears: input.candidateRotationYears[best],
    bestCandidateLandExpectationValue: landExpectationValues[best],
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  candidateRotationYears: [1, 2],
  netHarvestRevenues: [30, 70],
  establishmentCost: 10,
  annualHoldingCost: 1,
  annualDiscountRate: 0.1,
} satisfies Input;
export const exampleOutput = {
  landExpectationValues: [180, 265.7142857142857],
  bestCandidateRotationYears: 2,
  bestCandidateLandExpectationValue: 265.7142857142857,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/rotation-length-optimal",
  title: "Optimal Rotation Length",
  description:
    "Select the best supplied rotation by perpetual equal-cycle land expectation value with establishment and year-end annual holding cost; fixed real discount/price/productivity assumptions, not a continuous biological optimum.",
  inputs: inputFields,
  outputs: [
    {
      id: "landExpectationValues",
      label: "Land expectation values",
      kind: "numberList",
    },
    {
      id: "bestCandidateRotationYears",
      label: "Best candidate rotation years",
      kind: "number",
    },
    {
      id: "bestCandidateLandExpectationValue",
      label: "Best candidate land expectation value",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      candidateRotationYears: value.candidateRotationYears as readonly number[],
      netHarvestRevenues: value.netHarvestRevenues as readonly number[],
      establishmentCost: value.establishmentCost as number,
      annualHoldingCost: value.annualHoldingCost as number,
      annualDiscountRate: value.annualDiscountRate as number,
    }),
});
export const run = tool.execute;
export default tool;
