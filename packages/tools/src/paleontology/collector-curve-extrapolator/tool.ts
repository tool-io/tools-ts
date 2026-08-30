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
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly collectionEfforts: readonly number[];
  readonly cumulativeObservedRichness: readonly number[];
  readonly predictionEffort: number;
}>;
export type Output = Readonly<{
  readonly fittedAsymptoticRichness: number;
  readonly fittedHalfSaturationEffort: number;
  readonly modelPredictedRichness: number;
  readonly isPredictionExtrapolated: boolean;
  readonly reciprocalFitRSquared: number;
}>;
const inputFields = [
  { id: "collectionEfforts", label: "Collection efforts", kind: "numberList" },
  {
    id: "cumulativeObservedRichness",
    label: "Cumulative observed richness",
    kind: "numberList",
  },
  { id: "predictionEffort", label: "Prediction effort", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.collectionEfforts.forEach((v) => positive(v, "collectionEfforts"));
  input.cumulativeObservedRichness.forEach((v) =>
    positive(v, "cumulativeObservedRichness"),
  );
  positive(input.predictionEffort, "predictionEffort");
  ordered(input.collectionEfforts, "collectionEfforts");
  if (
    input.cumulativeObservedRichness.some(
      (v, i) => i > 0 && v < input.cumulativeObservedRichness[i - 1],
    )
  )
    simpleError("richness", "Nondecreasing collector richness required.");
  const fit = regression(
      input.collectionEfforts.map((v) => 1 / v),
      input.cumulativeObservedRichness.map((v) => 1 / v),
    ),
    asym = 1 / positive(fit.intercept, "asymptote"),
    half = nonnegative(fit.slope * asym, "halfSaturation");
  return {
    fittedAsymptoticRichness: asym,
    fittedHalfSaturationEffort: half,
    modelPredictedRichness:
      (asym * input.predictionEffort) / (half + input.predictionEffort),
    isPredictionExtrapolated:
      input.predictionEffort > input.collectionEfforts.at(-1)! ||
      input.predictionEffort < input.collectionEfforts[0],
    reciprocalFitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  collectionEfforts: [1, 2, 4],
  cumulativeObservedRichness: [5, 6.666666666666667, 8],
  predictionEffort: 8,
} satisfies Input;
export const exampleOutput = {
  fittedAsymptoticRichness: 10,
  fittedHalfSaturationEffort: 1,
  modelPredictedRichness: 8.88888888888889,
  isPredictionExtrapolated: true,
  reciprocalFitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/collector-curve-extrapolator",
  title: "Collector Curve Species Accumulation Extrapolator",
  description:
    "Fit a reciprocal-linearized Michaelis–Menten collector curve and flag prediction extrapolation; distinct from existing one-segment new-species/effort slope, with no guaranteed asymptotic true diversity.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedAsymptoticRichness",
      label: "Fitted asymptotic richness",
      kind: "number",
    },
    {
      id: "fittedHalfSaturationEffort",
      label: "Fitted half saturation effort",
      kind: "number",
    },
    {
      id: "modelPredictedRichness",
      label: "Model predicted richness",
      kind: "number",
    },
    {
      id: "isPredictionExtrapolated",
      label: "Is prediction extrapolated",
      kind: "boolean",
    },
    {
      id: "reciprocalFitRSquared",
      label: "Reciprocal fit r squared",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      collectionEfforts: value.collectionEfforts as readonly number[],
      cumulativeObservedRichness:
        value.cumulativeObservedRichness as readonly number[],
      predictionEffort: value.predictionEffort as number,
    }),
});
export const run = tool.execute;
export default tool;
