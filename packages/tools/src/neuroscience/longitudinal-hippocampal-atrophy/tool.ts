import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly leftVolumesMm3: readonly number[];
  readonly rightVolumesMm3: readonly number[];
  readonly elapsedYears: readonly number[];
}>;
export type Output = Readonly<{
  readonly bilateralVolumesMm3: readonly number[];
  readonly annualizedLogVolumeChangePercent: number;
  readonly linearAnnualLossMm3: number;
}>;
const inputFields = [
  { id: "leftVolumesMm3", label: "Left volumes mm3", kind: "numberList" },
  { id: "rightVolumesMm3", label: "Right volumes mm3", kind: "numberList" },
  { id: "elapsedYears", label: "Elapsed years", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.leftVolumesMm3, input.rightVolumesMm3, "leftVolumesMm3");
  aligned(input.elapsedYears, input.leftVolumesMm3, "elapsedYears");
  ordered(input.elapsedYears, "elapsedYears");
  input.elapsedYears.forEach((v) => nonnegative(v, "elapsedYears"));
  input.leftVolumesMm3.forEach((v) => positive(v, "leftVolumesMm3"));
  input.rightVolumesMm3.forEach((v) => positive(v, "rightVolumesMm3"));
  const bilateralVolumesMm3 = input.leftVolumesMm3.map(
      (v, i) => v + input.rightVolumesMm3[i],
    ),
    fit = regression(input.elapsedYears, bilateralVolumesMm3.map(Math.log)),
    linear = regression(input.elapsedYears, bilateralVolumesMm3);
  return {
    bilateralVolumesMm3,
    annualizedLogVolumeChangePercent: 100 * fit.slope,
    linearAnnualLossMm3: -linear.slope,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  leftVolumesMm3: [3000, 2700],
  rightVolumesMm3: [3000, 2700],
  elapsedYears: [0, 2],
} satisfies Input;
export const exampleOutput = {
  bilateralVolumesMm3: [6000, 5400],
  annualizedLogVolumeChangePercent: -5.268025782891314,
  linearAnnualLossMm3: 300,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/longitudinal-hippocampal-atrophy",
  title: "Hippocampal Atrophy Rate",
  description:
    "Fit all supplied longitudinal bilateral hippocampal volumes in log and linear space; signed annual log change and signed volume loss preserve growth rather than forcing atrophy.",
  inputs: inputFields,
  outputs: [
    {
      id: "bilateralVolumesMm3",
      label: "Bilateral volumes mm3",
      kind: "numberList",
    },
    {
      id: "annualizedLogVolumeChangePercent",
      label: "Annualized log volume change percent",
      kind: "number",
    },
    {
      id: "linearAnnualLossMm3",
      label: "Linear annual loss mm3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      leftVolumesMm3: value.leftVolumesMm3 as readonly number[],
      rightVolumesMm3: value.rightVolumesMm3 as readonly number[],
      elapsedYears: value.elapsedYears as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
