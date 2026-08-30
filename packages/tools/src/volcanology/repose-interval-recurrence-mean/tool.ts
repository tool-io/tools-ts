import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  ordered,
  mean,
  variance,
} from "../shared.js";
export type Input = Readonly<{
  readonly eruptionOnsetYears: readonly number[];
  readonly catalogEndYear: number;
}>;
export type Output = Readonly<{
  readonly completedReposeIntervalsYears: readonly number[];
  readonly meanCompletedReposeYears: number;
  readonly sampleReposeStandardDeviationYears: number;
  readonly rightCensoredCurrentReposeYears: number;
}>;
const inputFields = [
  {
    id: "eruptionOnsetYears",
    label: "Eruption onset years",
    kind: "numberList",
  },
  { id: "catalogEndYear", label: "Catalog end year", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  ordered(input.eruptionOnsetYears, "eruptionOnsetYears");
  const rightCensoredCurrentReposeYears = nonnegative(
      input.catalogEndYear - input.eruptionOnsetYears.at(-1)!,
      "catalogEndYear",
    ),
    completedReposeIntervalsYears = input.eruptionOnsetYears
      .slice(1)
      .map((v, i) => v - input.eruptionOnsetYears[i]);
  return {
    completedReposeIntervalsYears,
    meanCompletedReposeYears: mean(completedReposeIntervalsYears),
    sampleReposeStandardDeviationYears: Math.sqrt(
      variance(completedReposeIntervalsYears),
    ),
    rightCensoredCurrentReposeYears,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  eruptionOnsetYears: [1900, 1910, 1930, 1960],
  catalogEndYear: 1970,
} satisfies Input;
export const exampleOutput = {
  completedReposeIntervalsYears: [10, 20, 30],
  meanCompletedReposeYears: 20,
  sampleReposeStandardDeviationYears: 10,
  rightCensoredCurrentReposeYears: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/repose-interval-recurrence-mean",
  title: "Repose Interval Recurrence Mean",
  description:
    "Summarize complete historical repose intervals separately from right-censored time since last onset; not a survival-corrected mean recurrence estimator or deterministic next-event forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "completedReposeIntervalsYears",
      label: "Completed repose intervals years",
      kind: "numberList",
    },
    {
      id: "meanCompletedReposeYears",
      label: "Mean completed repose years",
      kind: "number",
    },
    {
      id: "sampleReposeStandardDeviationYears",
      label: "Sample repose standard deviation years",
      kind: "number",
    },
    {
      id: "rightCensoredCurrentReposeYears",
      label: "Right censored current repose years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      eruptionOnsetYears: value.eruptionOnsetYears as readonly number[],
      catalogEndYear: value.catalogEndYear as number,
    }),
});
export const run = tool.execute;
export default tool;
