import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  sequence,
  curve,
  normalQuantile,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly independentlyCalibratedPrecipitationCoordinates: readonly number[];
  readonly independentlyCalibratedPrecipitationCdf: readonly number[];
  readonly observedMatchedPrecipitation: number;
}>;
export type Output = Readonly<{
  readonly conditionalStandardNormalIndex: number;
  readonly matchedCdfProbability: number;
}>;
const inputFields = [
  {
    id: "independentlyCalibratedPrecipitationCoordinates",
    label: "Independently calibrated precipitation coordinates",
    kind: "numberList",
  },
  {
    id: "independentlyCalibratedPrecipitationCdf",
    label: "Independently calibrated precipitation cdf",
    kind: "numberList",
  },
  {
    id: "observedMatchedPrecipitation",
    label: "Observed matched precipitation",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.independentlyCalibratedPrecipitationCdf.forEach((v) =>
    fraction(v, "calibratedCDF"),
  );
  sequence(input.independentlyCalibratedPrecipitationCdf, "CDF");
  input.independentlyCalibratedPrecipitationCoordinates.forEach((v) =>
    nonnegative(v, "precipitation"),
  );
  nonnegative(input.observedMatchedPrecipitation, "precipitation");
  const p = curve(
    input.independentlyCalibratedPrecipitationCoordinates,
    input.independentlyCalibratedPrecipitationCdf,
    input.observedMatchedPrecipitation,
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
  independentlyCalibratedPrecipitationCoordinates: [0, 1, 2],
  independentlyCalibratedPrecipitationCdf: [0.1, 0.5, 0.9],
  observedMatchedPrecipitation: 1,
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
  id: "climatology/spi-index",
  title: "Standardized Precipitation Index SPI Calculator",
  description:
    "SPI standard-normal transform of an independently season/aggregation-matched precipitation CDF calibration. Zero-mass treatment and baseline completeness are caller verified; no automatic gamma fit or tail extrapolation.  Caller independently establishes homogeneous observation coverage and model/reference applicability; not observed future climate, crop suitability or validated drought severity.",
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
      independentlyCalibratedPrecipitationCoordinates:
        value.independentlyCalibratedPrecipitationCoordinates as readonly number[],
      independentlyCalibratedPrecipitationCdf:
        value.independentlyCalibratedPrecipitationCdf as readonly number[],
      observedMatchedPrecipitation:
        value.observedMatchedPrecipitation as number,
    }),
});
export const run = tool.execute;
export default tool;
