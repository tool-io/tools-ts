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
  maximum,
  minimum,
  logPowerFit,
} from "../shared.js";
export type Input = Readonly<{
  readonly phosphorusMicrogramsPerLiter: readonly number[];
  readonly chlorophyllMicrogramsPerLiter: readonly number[];
  readonly queryPhosphorusMicrogramsPerLiter: number;
}>;
export type Output = Readonly<{
  readonly fittedCoefficient: number;
  readonly fittedExponent: number;
  readonly predictedMedianChlorophyllMicrogramsPerLiter: number;
  readonly logFitRSquared: number;
}>;
const inputFields = [
  {
    id: "phosphorusMicrogramsPerLiter",
    label: "Phosphorus micrograms per liter",
    kind: "numberList",
  },
  {
    id: "chlorophyllMicrogramsPerLiter",
    label: "Chlorophyll micrograms per liter",
    kind: "numberList",
  },
  {
    id: "queryPhosphorusMicrogramsPerLiter",
    label: "Query phosphorus micrograms per liter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.queryPhosphorusMicrogramsPerLiter,
    "queryPhosphorusMicrogramsPerLiter",
  );
  const fit = logPowerFit(
    input.phosphorusMicrogramsPerLiter,
    input.chlorophyllMicrogramsPerLiter,
  );
  if (
    input.queryPhosphorusMicrogramsPerLiter <
      minimum(input.phosphorusMicrogramsPerLiter) ||
    input.queryPhosphorusMicrogramsPerLiter >
      maximum(input.phosphorusMicrogramsPerLiter)
  )
    simpleError(
      "queryPhosphorusMicrogramsPerLiter",
      "Query within calibration range required.",
    );
  return {
    fittedCoefficient: fit.coefficient,
    fittedExponent: fit.exponent,
    predictedMedianChlorophyllMicrogramsPerLiter:
      fit.coefficient * input.queryPhosphorusMicrogramsPerLiter ** fit.exponent,
    logFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  phosphorusMicrogramsPerLiter: [1, 2, 4],
  chlorophyllMicrogramsPerLiter: [2, 8, 32],
  queryPhosphorusMicrogramsPerLiter: 3,
} satisfies Input;
export const exampleOutput = {
  fittedCoefficient: 2,
  fittedExponent: 2,
  predictedMedianChlorophyllMicrogramsPerLiter: 18,
  logFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/chlorophyll-phosphorus-regression-prediction",
  title: "Chlorophyll Phosphorus Regression Prediction",
  description:
    "Fit a log-power chlorophyll/phosphorus relation to caller observations with within-range median prediction; no mutable published regression or uncorrected arithmetic-mean claim.",
  inputs: inputFields,
  outputs: [
    { id: "fittedCoefficient", label: "Fitted coefficient", kind: "number" },
    { id: "fittedExponent", label: "Fitted exponent", kind: "number" },
    {
      id: "predictedMedianChlorophyllMicrogramsPerLiter",
      label: "Predicted median chlorophyll micrograms per liter",
      kind: "number",
    },
    { id: "logFitRSquared", label: "Log fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      phosphorusMicrogramsPerLiter:
        value.phosphorusMicrogramsPerLiter as readonly number[],
      chlorophyllMicrogramsPerLiter:
        value.chlorophyllMicrogramsPerLiter as readonly number[],
      queryPhosphorusMicrogramsPerLiter:
        value.queryPhosphorusMicrogramsPerLiter as number,
    }),
});
export const run = tool.execute;
export default tool;
