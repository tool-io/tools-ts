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
  nonnegative,
  aligned,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly observationYears: readonly number[];
  readonly normalizedIceOutCycleDays: readonly number[];
  readonly annualCycleDays: number;
  readonly referenceUnwrapCycleDay: number;
  readonly predictionYear: number;
}>;
export type Output = Readonly<{
  readonly trendDaysPerYear: number;
  readonly fittedCycleDayAtPredictionYear: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "observationYears", label: "Observation years", kind: "numberList" },
  {
    id: "normalizedIceOutCycleDays",
    label: "Normalized ice out cycle days",
    kind: "numberList",
  },
  { id: "annualCycleDays", label: "Annual cycle days", kind: "number" },
  {
    id: "referenceUnwrapCycleDay",
    label: "Reference unwrap cycle day",
    kind: "number",
  },
  { id: "predictionYear", label: "Prediction year", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.annualCycleDays, "annualCycleDays");
  input.normalizedIceOutCycleDays.forEach((v) =>
    nonnegative(v, "normalizedIceOutCycleDays"),
  );
  nonnegative(input.referenceUnwrapCycleDay, "referenceUnwrapCycleDay");
  ordered(input.observationYears, "observationYears");
  aligned(
    input.observationYears,
    input.normalizedIceOutCycleDays,
    "observationYears",
  );
  if (
    input.normalizedIceOutCycleDays.some((v) => v >= input.annualCycleDays) ||
    input.referenceUnwrapCycleDay >= input.annualCycleDays
  )
    simpleError(
      "normalizedIceOutCycleDays",
      "Cycle phases in [0,period) required; normalize leap-year dates externally.",
    );
  const p = input.annualCycleDays,
    wrap = (v: number) => ((v % p) + p) % p,
    anomalies = input.normalizedIceOutCycleDays.map(
      (v) => wrap(v - input.referenceUnwrapCycleDay + p / 2) - p / 2,
    ),
    fit = regression(input.observationYears, anomalies);
  if (
    input.predictionYear < input.observationYears[0] ||
    input.predictionYear > input.observationYears.at(-1)!
  )
    simpleError(
      "predictionYear",
      "Within-observed-range prediction year required.",
    );
  return {
    trendDaysPerYear: fit.slope,
    fittedCycleDayAtPredictionYear: wrap(
      input.referenceUnwrapCycleDay +
        fit.intercept +
        fit.slope * input.predictionYear,
    ),
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationYears: [2000, 2001, 2002],
  normalizedIceOutCycleDays: [120, 118, 116],
  annualCycleDays: 365,
  referenceUnwrapCycleDay: 120,
  predictionYear: 2001,
} satisfies Input;
export const exampleOutput = {
  trendDaysPerYear: -2,
  fittedCycleDayAtPredictionYear: 118,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/ice-out-date-trend-slope",
  title: "Ice Out Date Trend Slope",
  description:
    "Fit ice-out trend after fixed-reference circular phase unwrapping on a supplied standardized annual cycle; dates must be leap-normalized and anomalies must be interpretable within a half cycle.",
  inputs: inputFields,
  outputs: [
    { id: "trendDaysPerYear", label: "Trend days per year", kind: "number" },
    {
      id: "fittedCycleDayAtPredictionYear",
      label: "Fitted cycle day at prediction year",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observationYears: value.observationYears as readonly number[],
      normalizedIceOutCycleDays:
        value.normalizedIceOutCycleDays as readonly number[],
      annualCycleDays: value.annualCycleDays as number,
      referenceUnwrapCycleDay: value.referenceUnwrapCycleDay as number,
      predictionYear: value.predictionYear as number,
    }),
});
export const run = tool.execute;
export default tool;
