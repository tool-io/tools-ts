import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  aligned,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesWeeks: readonly number[];
  readonly measuredStoresKg: readonly number[];
  readonly cumulativeAddedFeedKg: readonly number[];
}>;
export type Output = Readonly<{
  readonly correctedStoreChangeKgPerWeek: number;
  readonly estimatedNetDepletionKgPerWeek: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "timesWeeks", label: "Times weeks", kind: "numberList" },
  { id: "measuredStoresKg", label: "Measured stores kg", kind: "numberList" },
  {
    id: "cumulativeAddedFeedKg",
    label: "Cumulative added feed kg",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredStoresKg.forEach((v) => nonnegative(v, "measuredStoresKg"));
  input.cumulativeAddedFeedKg.forEach((v) =>
    nonnegative(v, "cumulativeAddedFeedKg"),
  );
  aligned(input.timesWeeks, input.measuredStoresKg, "timesWeeks");
  aligned(input.timesWeeks, input.cumulativeAddedFeedKg, "timesWeeks");
  ordered(input.timesWeeks, "timesWeeks");
  if (
    input.cumulativeAddedFeedKg.some(
      (v, i) => i > 0 && v < input.cumulativeAddedFeedKg[i - 1],
    )
  )
    simpleError(
      "cumulativeAddedFeedKg",
      "Cumulative additions cannot decrease.",
    );
  const fit = regression(
    input.timesWeeks,
    input.measuredStoresKg.map((v, i) => v - input.cumulativeAddedFeedKg[i]),
  );
  return {
    correctedStoreChangeKgPerWeek: fit.slope,
    estimatedNetDepletionKgPerWeek: -fit.slope,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesWeeks: [0, 1, 2],
  measuredStoresKg: [10, 12, 9],
  cumulativeAddedFeedKg: [0, 4, 4],
} satisfies Input;
export const exampleOutput = {
  correctedStoreChangeKgPerWeek: -2.5,
  estimatedNetDepletionKgPerWeek: 2.5,
  fitRSquared: 0.9868421052631579,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/stores-depletion-rate-per-week",
  title: "Stores Depletion Rate Per Week",
  description:
    "Fit net store trend after explicit cumulative feed additions; assumes store mass has already been corrected for hive/brood tare and does not attribute all loss to consumption.",
  inputs: inputFields,
  outputs: [
    {
      id: "correctedStoreChangeKgPerWeek",
      label: "Corrected store change kg per week",
      kind: "number",
    },
    {
      id: "estimatedNetDepletionKgPerWeek",
      label: "Estimated net depletion kg per week",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesWeeks: value.timesWeeks as readonly number[],
      measuredStoresKg: value.measuredStoresKg as readonly number[],
      cumulativeAddedFeedKg: value.cumulativeAddedFeedKg as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
