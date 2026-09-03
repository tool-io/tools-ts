import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  sequence,
  curve,
  normalQuantile,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly independentlyCalibratedWaterBalanceCoordinates: readonly number[];
  readonly independentlyCalibratedWaterBalanceCdf: readonly number[];
  readonly observedMatchedWaterBalance: number;
}>;
export type Output = Readonly<{
  readonly conditionalStandardNormalIndex: number;
  readonly matchedCdfProbability: number;
}>;
const inputFields = [
  {
    id: "independentlyCalibratedWaterBalanceCoordinates",
    label: "Independently calibrated water balance coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyCalibratedWaterBalanceCdf",
    label: "Independently calibrated water balance cdf",
    kind: "numberList",
  },
  {
    id: "observedMatchedWaterBalance",
    label: "Observed matched water balance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.independentlyCalibratedWaterBalanceCdf.forEach((v) =>
    fraction(v, "calibratedCDF"),
  );
  sequence(input.independentlyCalibratedWaterBalanceCdf, "CDF");
  const p = curve(
    input.independentlyCalibratedWaterBalanceCoordinates,
    input.independentlyCalibratedWaterBalanceCdf,
    input.observedMatchedWaterBalance,
  ).value;
  return {
    conditionalStandardNormalIndex: normalQuantile(p),
    matchedCdfProbability: p,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  independentlyCalibratedWaterBalanceCoordinates: [-1, 0, 1],
  independentlyCalibratedWaterBalanceCdf: [0.1, 0.5, 0.9],
  observedMatchedWaterBalance: 0,
} satisfies Input;
export const exampleOutput = {
  conditionalStandardNormalIndex: 0,
  matchedCdfProbability: 0.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/spei-index",
  title: "Standardized Precipitation Evapotranspiration Index SPEI Calculator",
  description:
    "SPEI standard-normal transform of an independently season/aggregation-matched precipitation-minus-PET CDF calibration. Water balance may be signed; no automatic log-logistic fit or tail extrapolation.  Caller independently establishes homogeneous observation coverage and model/reference applicability; not observed future climate, crop suitability or validated drought severity.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalStandardNormalIndex",
      label: "Conditional standard normal index",
      kind: "number",
    },
    {
      id: "matchedCdfProbability",
      label: "Matched cdf probability",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      independentlyCalibratedWaterBalanceCoordinates:
        value.independentlyCalibratedWaterBalanceCoordinates as readonly number[],
      independentlyCalibratedWaterBalanceCdf:
        value.independentlyCalibratedWaterBalanceCdf as readonly number[],
      observedMatchedWaterBalance: value.observedMatchedWaterBalance as number,
    }),
});
export const run = tool.execute;
export default tool;
