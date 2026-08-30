import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  count,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly snagCountsByPlot: readonly number[];
  readonly sampledPlotAreasHa: readonly number[];
  readonly snagDetectionProbabilities: readonly number[];
}>;
export type Output = Readonly<{
  readonly detectionAdjustedSnagsPerHa: number;
  readonly independentPoissonDensityStandardErrorPerHa: number;
}>;
const inputFields = [
  { id: "snagCountsByPlot", label: "Snag counts by plot", kind: "numberList" },
  {
    id: "sampledPlotAreasHa",
    label: "Sampled plot areas ha",
    kind: "numberList",
  },
  {
    id: "snagDetectionProbabilities",
    label: "Snag detection probabilities",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.sampledPlotAreasHa.forEach((v) => positive(v, "sampledPlotAreasHa"));
  input.snagDetectionProbabilities.forEach((v) =>
    positive(v, "snagDetectionProbabilities"),
  );
  input.snagDetectionProbabilities.forEach((v) =>
    fraction(v, "snagDetectionProbabilities"),
  );
  input.snagCountsByPlot.forEach((v) => count(v, "snagCountsByPlot"));
  aligned(input.snagCountsByPlot, input.sampledPlotAreasHa, "snagCountsByPlot");
  aligned(
    input.snagCountsByPlot,
    input.snagDetectionProbabilities,
    "snagCountsByPlot",
  );
  const area = input.sampledPlotAreasHa.reduce((a, b) => a + b, 0),
    adjusted = input.snagCountsByPlot.reduce(
      (s, v, i) => s + v / input.snagDetectionProbabilities[i],
      0,
    ),
    varCount = input.snagCountsByPlot.reduce(
      (s, v, i) => s + v / input.snagDetectionProbabilities[i] ** 2,
      0,
    );
  return {
    detectionAdjustedSnagsPerHa: adjusted / area,
    independentPoissonDensityStandardErrorPerHa: Math.sqrt(varCount) / area,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  snagCountsByPlot: [2, 3],
  sampledPlotAreasHa: [0.1, 0.2],
  snagDetectionProbabilities: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  detectionAdjustedSnagsPerHa: 23.333333333333332,
  independentPoissonDensityStandardErrorPerHa: 11.055415967851333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/snag-density",
  title: "Snag Density",
  description:
    "Pool unequal-area snag surveys with caller differential detection and independent Poisson count error; unlike existing fixed-plot tree expansion, correction/uncertainty require extra measured assumptions.",
  inputs: inputFields,
  outputs: [
    {
      id: "detectionAdjustedSnagsPerHa",
      label: "Detection adjusted snags per ha",
      kind: "number",
    },
    {
      id: "independentPoissonDensityStandardErrorPerHa",
      label: "Independent poisson density standard error per ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      snagCountsByPlot: value.snagCountsByPlot as readonly number[],
      sampledPlotAreasHa: value.sampledPlotAreasHa as readonly number[],
      snagDetectionProbabilities:
        value.snagDetectionProbabilities as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
