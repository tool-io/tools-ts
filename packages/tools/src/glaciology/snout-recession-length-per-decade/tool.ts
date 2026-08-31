import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  aligned,
  strictlyIncreasing,
  interpolate,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observationYears: readonly number[];
  readonly outwardSnoutPositionsM: readonly number[];
  readonly decadeStartYears: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedInterpolatedRecessionMPerDecade: readonly number[];
}>;
const inputFields = [
  { id: "observationYears", label: "Observation years", kind: "numberList" },
  {
    id: "outwardSnoutPositionsM",
    label: "Outward snout positions m",
    kind: "numberList",
  },
  { id: "decadeStartYears", label: "Decade start years", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.decadeStartYears.forEach((v) => integer(v, "decadeStartYears"));
  aligned(
    input.observationYears,
    input.outwardSnoutPositionsM,
    "observationYears",
  );
  strictlyIncreasing(input.observationYears, "years");
  return {
    observedInterpolatedRecessionMPerDecade: input.decadeStartYears.map(
      (y) =>
        interpolate(input.observationYears, input.outwardSnoutPositionsM, y) -
        interpolate(
          input.observationYears,
          input.outwardSnoutPositionsM,
          y + 10,
        ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationYears: [2000, 2005, 2010, 2020],
  outwardSnoutPositionsM: [1000, 900, 800, 500],
  decadeStartYears: [2000, 2010],
} satisfies Input;
export const exampleOutput = {
  observedInterpolatedRecessionMPerDecade: [200, 300],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/snout-recession-length-per-decade",
  title: "Snout Recession Length Per Decade Calculator",
  description:
    "Integrate exact caller decade windows using interpolation only within observed snout positions, reporting actual displacement per decade; no rescaling a short rate to unobserved ten-year periods.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedInterpolatedRecessionMPerDecade",
      label: "Observed interpolated recession m per decade",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observationYears: value.observationYears as readonly number[],
      outwardSnoutPositionsM: value.outwardSnoutPositionsM as readonly number[],
      decadeStartYears: value.decadeStartYears as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
