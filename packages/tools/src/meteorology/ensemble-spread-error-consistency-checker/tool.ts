import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  mean,
  variance,
  shape,
} from "../shared.js";

export type Input = Readonly<{
  readonly ensembleForecastsByCase: readonly (readonly number[])[];
  readonly observationsByCase: readonly number[];
}>;
export type Output = Readonly<{
  readonly ensembleMeanForecasts: readonly number[];
  readonly ensembleMeanRmse: number;
  readonly rmsUnbiasedEnsembleSpread: number;
  readonly finiteMemberExpectedSpreadErrorRatio: number;
}>;
const inputFields = [
  {
    id: "ensembleForecastsByCase",
    label: "Ensemble forecasts by case",
    kind: "matrix",
  },
  {
    id: "observationsByCase",
    label: "Observations by case",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const m = shape(input.ensembleForecastsByCase, "ensemble");
  if (m < 2)
    simpleError("members", "At least two ensemble members per case required.");
  aligned(input.ensembleForecastsByCase, input.observationsByCase, "cases");
  const ensembleMeanForecasts = input.ensembleForecastsByCase.map(mean),
    ensembleMeanRmse = positive(
      Math.sqrt(
        mean(
          ensembleMeanForecasts.map(
            (v, i) => (v - input.observationsByCase[i]) ** 2,
          ),
        ),
      ),
      "rmse",
    ),
    rmsUnbiasedEnsembleSpread = Math.sqrt(
      mean(input.ensembleForecastsByCase.map(variance)),
    );
  return {
    ensembleMeanForecasts,
    ensembleMeanRmse,
    rmsUnbiasedEnsembleSpread,
    finiteMemberExpectedSpreadErrorRatio:
      (rmsUnbiasedEnsembleSpread * Math.sqrt(1 + 1 / m)) / ensembleMeanRmse,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ensembleForecastsByCase: [
    [0, 2],
    [1, 3],
  ],
  observationsByCase: [2, 3],
} satisfies Input;
export const exampleOutput = {
  ensembleMeanForecasts: [1, 2],
  ensembleMeanRmse: 1,
  rmsUnbiasedEnsembleSpread: 1.4142135623730951,
  finiteMemberExpectedSpreadErrorRatio: 1.7320508075688772,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/ensemble-spread-error-consistency-checker",
  title: "Ensemble Spread Error Consistency Checker",
  description:
    "Compare case-wise ensemble-mean RMSE with unbiased member variance under finite-M exchangeability factor sqrt(1+1/M); descriptive comparison, no reliability test/independence claim and perfect zero-error ratio undefined.",
  inputs: inputFields,
  outputs: [
    {
      id: "ensembleMeanForecasts",
      label: "Ensemble mean forecasts",
      kind: "numberList",
    },
    { id: "ensembleMeanRmse", label: "Ensemble mean rmse", kind: "number" },
    {
      id: "rmsUnbiasedEnsembleSpread",
      label: "Rms unbiased ensemble spread",
      kind: "number",
    },
    {
      id: "finiteMemberExpectedSpreadErrorRatio",
      label: "Finite member expected spread error ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ensembleForecastsByCase:
        value.ensembleForecastsByCase as readonly (readonly number[])[],
      observationsByCase: value.observationsByCase as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
