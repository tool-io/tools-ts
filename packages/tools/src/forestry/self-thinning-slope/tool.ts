import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, regression } from "../shared.js";
export type Input = Readonly<{
  readonly stemDensitiesPerHa: readonly number[];
  readonly meanStemDryMassKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly logMassLogDensitySlope: number;
  readonly logFitRSquared: number;
}>;
const inputFields = [
  {
    id: "stemDensitiesPerHa",
    label: "Stem densities per ha",
    kind: "numberList",
  },
  {
    id: "meanStemDryMassKg",
    label: "Mean stem dry mass kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.stemDensitiesPerHa.forEach((v) => positive(v, "stemDensitiesPerHa"));
  input.meanStemDryMassKg.forEach((v) => positive(v, "meanStemDryMassKg"));
  const fit = regression(
    input.stemDensitiesPerHa.map(Math.log),
    input.meanStemDryMassKg.map(Math.log),
  );
  return { logMassLogDensitySlope: fit.slope, logFitRSquared: fit.rSquared };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stemDensitiesPerHa: [100, 200, 400],
  meanStemDryMassKg: [8, 4, 2],
} satisfies Input;
export const exampleOutput = {
  logMassLogDensitySlope: -1,
  logFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/self-thinning-slope",
  title: "Self Thinning Slope",
  description:
    "Fit log mean-stem dry mass versus log stem density to observed self-thinning samples; unlike Reineke DBH stand density, no fixed -3/2 slope or maximum-density relationship is imposed.",
  inputs: inputFields,
  outputs: [
    {
      id: "logMassLogDensitySlope",
      label: "Log mass log density slope",
      kind: "number",
    },
    { id: "logFitRSquared", label: "Log fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      stemDensitiesPerHa: value.stemDensitiesPerHa as readonly number[],
      meanStemDryMassKg: value.meanStemDryMassKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
