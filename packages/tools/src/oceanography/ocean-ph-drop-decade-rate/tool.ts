import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, ordered, regression } from "../shared.js";
export type Input = Readonly<{
  readonly timesYears: readonly number[];
  readonly phValues: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedPhChangePerDecade: number;
  readonly hydrogenActivityMultiplierPerDecade: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "timesYears", label: "Times years", kind: "numberList" },
  { id: "phValues", label: "Ph values", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.timesYears, "timesYears");
  const fit = regression(input.timesYears, input.phValues),
    fittedPhChangePerDecade = 10 * fit.slope;
  return {
    fittedPhChangePerDecade,
    hydrogenActivityMultiplierPerDecade: 10 ** -fittedPhChangePerDecade,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesYears: [0, 1, 2],
  phValues: [8, 7.9, 7.8],
} satisfies Input;
export const exampleOutput = {
  fittedPhChangePerDecade: -1,
  hydrogenActivityMultiplierPerDecade: 10,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/ocean-ph-drop-decade-rate",
  title: "Ocean PH Drop Decade Rate",
  description:
    "Fit observed pH trend and its multiplicative hydrogen-activity interpretation on one consistent pH scale; pH is logarithmic, and activity is not molar concentration without an activity convention.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedPhChangePerDecade",
      label: "Fitted ph change per decade",
      kind: "number",
    },
    {
      id: "hydrogenActivityMultiplierPerDecade",
      label: "Hydrogen activity multiplier per decade",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesYears: value.timesYears as readonly number[],
      phValues: value.phValues as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
