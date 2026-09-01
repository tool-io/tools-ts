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
  mean,
  sum,
  nPvi,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observedSyllableDurationsMs: readonly number[];
  readonly observedVocalicIntervalsMs: readonly number[];
  readonly observedConsonantalIntervalsMs: readonly number[];
  readonly callerHighNpviThreshold: number;
}>;
export type Output = Readonly<{
  readonly syllableNormalizedPairwiseVariabilityIndex: number;
  readonly syllablePopulationCoefficientOfVariation: number;
  readonly observedVocalicIntervalSharePercent: number;
  readonly aboveCallerNpviThreshold: boolean;
}>;
const inputFields = [
  {
    id: "observedSyllableDurationsMs",
    label: "Observed syllable durations ms",
    kind: "numberList",
  },
  {
    id: "observedVocalicIntervalsMs",
    label: "Observed vocalic intervals ms",
    kind: "numberList",
  },
  {
    id: "observedConsonantalIntervalsMs",
    label: "Observed consonantal intervals ms",
    kind: "numberList",
  },
  {
    id: "callerHighNpviThreshold",
    label: "Caller high npvi threshold",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSyllableDurationsMs.forEach((v) =>
    positive(v, "observedSyllableDurationsMs"),
  );
  input.observedVocalicIntervalsMs.forEach((v) =>
    positive(v, "observedVocalicIntervalsMs"),
  );
  input.observedConsonantalIntervalsMs.forEach((v) =>
    positive(v, "observedConsonantalIntervalsMs"),
  );
  nonnegative(input.callerHighNpviThreshold, "callerHighNpviThreshold");
  const npvi = nPvi(input.observedSyllableDurationsMs),
    syllableTotal = sum(input.observedSyllableDurationsMs),
    v = sum(input.observedVocalicIntervalsMs),
    c = sum(input.observedConsonantalIntervalsMs);
  if (
    !input.observedVocalicIntervalsMs.length ||
    !input.observedConsonantalIntervalsMs.length ||
    Math.abs(syllableTotal - v - c) > 1e-8 * Math.max(1, syllableTotal)
  )
    simpleError(
      "coverage",
      "Complete syllable and vocalic/consonantal interval inventories must cover the same caller window.",
    );
  const avg = mean(input.observedSyllableDurationsMs),
    variance =
      input.observedSyllableDurationsMs.reduce(
        (s, x) => s + (x - avg) ** 2,
        0,
      ) / input.observedSyllableDurationsMs.length;
  return {
    syllableNormalizedPairwiseVariabilityIndex: npvi,
    syllablePopulationCoefficientOfVariation: Math.sqrt(variance) / avg,
    observedVocalicIntervalSharePercent: (100 * v) / (v + c),
    aboveCallerNpviThreshold: npvi > input.callerHighNpviThreshold,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSyllableDurationsMs: [100, 200, 100],
  observedVocalicIntervalsMs: [100, 100],
  observedConsonantalIntervalsMs: [100, 100],
  callerHighNpviThreshold: 50,
} satisfies Input;
export const exampleOutput = {
  syllableNormalizedPairwiseVariabilityIndex: 66.66666666666667,
  syllablePopulationCoefficientOfVariation: 0.3535533905932738,
  observedVocalicIntervalSharePercent: 50,
  aboveCallerNpviThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "linguistics/stress-timed-vs-syllable-timed-classifier",
  title: "Stress-Timed vs Syllable-Timed Classifier",
  description:
    "Audit measured nPVI, population syllable variability and %V over reconciled actual interval coverage under caller threshold; does not assign language rhythm classes, prove isochrony or extract intervals from audio.",
  inputs: inputFields,
  outputs: [
    {
      id: "syllableNormalizedPairwiseVariabilityIndex",
      label: "Syllable normalized pairwise variability index",
      kind: "number",
    },
    {
      id: "syllablePopulationCoefficientOfVariation",
      label: "Syllable population coefficient of variation",
      kind: "number",
    },
    {
      id: "observedVocalicIntervalSharePercent",
      label: "Observed vocalic interval share percent",
      kind: "number",
    },
    {
      id: "aboveCallerNpviThreshold",
      label: "Above caller npvi threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSyllableDurationsMs:
        value.observedSyllableDurationsMs as readonly number[],
      observedVocalicIntervalsMs:
        value.observedVocalicIntervalsMs as readonly number[],
      observedConsonantalIntervalsMs:
        value.observedConsonantalIntervalsMs as readonly number[],
      callerHighNpviThreshold: value.callerHighNpviThreshold as number,
    }),
});
export const run = tool.execute;
export default tool;
