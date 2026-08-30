import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  ordered,
  median,
  boundedPairs,
} from "../shared.js";

export type Input = Readonly<{
  readonly observationYears: readonly number[];
  readonly observedValues: readonly number[];
}>;
export type Output = Readonly<{
  readonly senSlopePerYear: number;
  readonly senSlopePerDecade: number;
  readonly pairwiseSlopeCount: number;
}>;
const inputFields = [
  { id: "observationYears", label: "Observation years", kind: "numberList" },
  { id: "observedValues", label: "Observed values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.observationYears, input.observedValues, "observationYears");
  ordered(input.observationYears, "years");
  boundedPairs(input.observationYears.length);
  const slopes: number[] = [];
  for (let i = 0; i < input.observationYears.length; i++)
    for (let j = i + 1; j < input.observationYears.length; j++)
      slopes.push(
        (input.observedValues[j] - input.observedValues[i]) /
          (input.observationYears[j] - input.observationYears[i]),
      );
  const senSlopePerYear = median(slopes);
  return {
    senSlopePerYear,
    senSlopePerDecade: 10 * senSlopePerYear,
    pairwiseSlopeCount: slopes.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationYears: [2000, 2001, 2002],
  observedValues: [1, 3, 6],
} satisfies Input;
export const exampleOutput = {
  senSlopePerYear: 2.5,
  senSlopePerDecade: 25,
  pairwiseSlopeCount: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/sen-slope-estimator",
  title: "Sen Slope Estimator",
  description:
    "Estimate Sen median of all pairwise slopes on actual irregular observation years; distinct from OLS regression and no independence-adjusted interval or extrapolation.",
  inputs: inputFields,
  outputs: [
    { id: "senSlopePerYear", label: "Sen slope per year", kind: "number" },
    { id: "senSlopePerDecade", label: "Sen slope per decade", kind: "number" },
    { id: "pairwiseSlopeCount", label: "Pairwise slope count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observationYears: value.observationYears as readonly number[],
      observedValues: value.observedValues as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
