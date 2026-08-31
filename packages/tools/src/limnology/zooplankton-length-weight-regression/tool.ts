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
  linearFit,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly observedLengthsMm: readonly number[];
  readonly observedDryMassMicrograms: readonly number[];
  readonly queryLengthMm: number;
}>;
export type Output = Readonly<{
  readonly fittedPowerExponent: number;
  readonly fittedCoefficientMicrogramsPerMmPower: number;
  readonly withinObservedRangeMedianPredictedMassMicrograms: number;
}>;
const inputFields = [
  { id: "observedLengthsMm", label: "Observed lengths mm", kind: "numberList" },
  {
    id: "observedDryMassMicrograms",
    label: "Observed dry mass micrograms",
    kind: "numberList",
  },
  { id: "queryLengthMm", label: "Query length mm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedLengthsMm.forEach((v) => positive(v, "observedLengthsMm"));
  input.observedDryMassMicrograms.forEach((v) =>
    positive(v, "observedDryMassMicrograms"),
  );
  positive(input.queryLengthMm, "queryLengthMm");
  aligned(
    input.observedLengthsMm,
    input.observedDryMassMicrograms,
    "observedLengthsMm",
  );
  if (
    input.queryLengthMm < Math.min(...input.observedLengthsMm) ||
    input.queryLengthMm > Math.max(...input.observedLengthsMm)
  )
    simpleError(
      "query",
      "No length-weight extrapolation beyond observed taxon/model range.",
    );
  const fit = linearFit(
      input.observedLengthsMm.map(Math.log),
      input.observedDryMassMicrograms.map(Math.log),
    ),
    coefficient = Math.exp(fit.intercept);
  return {
    fittedPowerExponent: fit.slope,
    fittedCoefficientMicrogramsPerMmPower: coefficient,
    withinObservedRangeMedianPredictedMassMicrograms: Math.exp(
      fit.intercept + fit.slope * Math.log(input.queryLengthMm),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLengthsMm: [1, 2, 4],
  observedDryMassMicrograms: [2, 8, 32],
  queryLengthMm: 2,
} satisfies Input;
export const exampleOutput = {
  fittedPowerExponent: 2,
  fittedCoefficientMicrogramsPerMmPower: 2,
  withinObservedRangeMedianPredictedMassMicrograms: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/zooplankton-length-weight-regression",
  title: "Zooplankton Length Weight Regression Calculator",
  description:
    "Fit caller matched zooplankton dry-mass/length log-power relation and within-range conditional median prediction; coefficients/taxon/units external, no arithmetic mean without log-residual correction or universal biomass equation.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedPowerExponent",
      label: "Fitted power exponent",
      kind: "number",
    },
    {
      id: "fittedCoefficientMicrogramsPerMmPower",
      label: "Fitted coefficient micrograms per mm power",
      kind: "number",
    },
    {
      id: "withinObservedRangeMedianPredictedMassMicrograms",
      label: "Within observed range median predicted mass micrograms",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLengthsMm: value.observedLengthsMm as readonly number[],
      observedDryMassMicrograms:
        value.observedDryMassMicrograms as readonly number[],
      queryLengthMm: value.queryLengthMm as number,
    }),
});
export const run = tool.execute;
export default tool;
