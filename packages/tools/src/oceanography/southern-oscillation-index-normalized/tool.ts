import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly stationPressuresHpa: readonly number[];
  readonly stationBaselineMeansHpa: readonly number[];
  readonly stationBaselineStandardDeviationsHpa: readonly number[];
  readonly baselineStandardizedDifferenceMean: number;
  readonly baselineStandardizedDifferenceSd: number;
  readonly indexScale: number;
}>;
export type Output = Readonly<{
  readonly standardizedStationAnomalies: readonly number[];
  readonly southernOscillationIndex: number;
}>;
const inputFields = [
  {
    id: "stationPressuresHpa",
    label: "Station pressures hpa",
    kind: "numberList",
  },
  {
    id: "stationBaselineMeansHpa",
    label: "Station baseline means hpa",
    kind: "numberList",
  },
  {
    id: "stationBaselineStandardDeviationsHpa",
    label: "Station baseline standard deviations hpa",
    kind: "numberList",
  },
  {
    id: "baselineStandardizedDifferenceMean",
    label: "Baseline standardized difference mean",
    kind: "number",
  },
  {
    id: "baselineStandardizedDifferenceSd",
    label: "Baseline standardized difference sd",
    kind: "number",
  },
  { id: "indexScale", label: "Index scale", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.stationBaselineStandardDeviationsHpa.forEach((v) =>
    positive(v, "stationBaselineStandardDeviationsHpa"),
  );
  positive(
    input.baselineStandardizedDifferenceSd,
    "baselineStandardizedDifferenceSd",
  );
  positive(input.indexScale, "indexScale");
  if (
    input.stationPressuresHpa.length !== 2 ||
    input.stationBaselineMeansHpa.length !== 2 ||
    input.stationBaselineStandardDeviationsHpa.length !== 2
  )
    simpleError(
      "stations",
      "Two ordered pressure stations and matched baseline statistics required.",
    );
  const standardizedStationAnomalies = input.stationPressuresHpa.map(
    (v, i) =>
      (v - input.stationBaselineMeansHpa[i]) /
      input.stationBaselineStandardDeviationsHpa[i],
  );
  return {
    standardizedStationAnomalies,
    southernOscillationIndex:
      (input.indexScale *
        (standardizedStationAnomalies[0] -
          standardizedStationAnomalies[1] -
          input.baselineStandardizedDifferenceMean)) /
      input.baselineStandardizedDifferenceSd,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  stationPressuresHpa: [1000, 1005],
  stationBaselineMeansHpa: [995, 1000],
  stationBaselineStandardDeviationsHpa: [5, 5],
  baselineStandardizedDifferenceMean: 0,
  baselineStandardizedDifferenceSd: 2,
  indexScale: 10,
} satisfies Input;
export const exampleOutput = {
  standardizedStationAnomalies: [1, 1],
  southernOscillationIndex: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/southern-oscillation-index-normalized",
  title: "Southern Oscillation Index Normalized",
  description:
    "Compute an explicitly ordered two-station standardized pressure-difference index with caller baseline normalization/scale; no mutable station climatology or official SOI method inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "standardizedStationAnomalies",
      label: "Standardized station anomalies",
      kind: "numberList",
    },
    {
      id: "southernOscillationIndex",
      label: "Southern oscillation index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      stationPressuresHpa: value.stationPressuresHpa as readonly number[],
      stationBaselineMeansHpa:
        value.stationBaselineMeansHpa as readonly number[],
      stationBaselineStandardDeviationsHpa:
        value.stationBaselineStandardDeviationsHpa as readonly number[],
      baselineStandardizedDifferenceMean:
        value.baselineStandardizedDifferenceMean as number,
      baselineStandardizedDifferenceSd:
        value.baselineStandardizedDifferenceSd as number,
      indexScale: value.indexScale as number,
    }),
});
export const run = tool.execute;
export default tool;
