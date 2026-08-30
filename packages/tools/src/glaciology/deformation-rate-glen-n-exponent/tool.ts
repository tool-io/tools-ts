import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, logPowerFit } from "../shared.js";
export type Input = Readonly<{
  readonly positiveStressPa: readonly number[];
  readonly positiveStrainRatesPerYear: readonly number[];
}>;
export type Output = Readonly<{
  readonly fittedGlenExponent: number;
  readonly fittedRateFactor: number;
  readonly logFitRSquared: number;
}>;
const inputFields = [
  { id: "positiveStressPa", label: "Positive stress pa", kind: "numberList" },
  {
    id: "positiveStrainRatesPerYear",
    label: "Positive strain rates per year",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const fit = logPowerFit(
    input.positiveStressPa,
    input.positiveStrainRatesPerYear,
  );
  if (fit.exponent <= 0)
    simpleError(
      "positiveStrainRatesPerYear",
      "Positive fitted stress exponent required.",
    );
  return {
    fittedGlenExponent: fit.exponent,
    fittedRateFactor: fit.coefficient,
    logFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  positiveStressPa: [1, 2, 4],
  positiveStrainRatesPerYear: [0.1, 0.8, 6.4],
} satisfies Input;
export const exampleOutput = {
  fittedGlenExponent: 3,
  fittedRateFactor: 0.1,
  logFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/deformation-rate-glen-n-exponent",
  title: "Deformation Rate Glen N Exponent",
  description:
    "Fit n and apparent A from positive stress/strain observations in log space; fitted A absorbs enhancement and calibration, unlike a forward Glen-law prediction.",
  inputs: inputFields,
  outputs: [
    { id: "fittedGlenExponent", label: "Fitted glen exponent", kind: "number" },
    { id: "fittedRateFactor", label: "Fitted rate factor", kind: "number" },
    { id: "logFitRSquared", label: "Log fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      positiveStressPa: value.positiveStressPa as readonly number[],
      positiveStrainRatesPerYear:
        value.positiveStrainRatesPerYear as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
