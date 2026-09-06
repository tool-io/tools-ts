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
  sum,
  strictlyIncreasing,
  ordered,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedWindowStartsYears: readonly number[];
  readonly observedWindowEndsYears: readonly number[];
  readonly observedAtlanticSstAnomaliesC: readonly number[];
  readonly callerWindowStartYear: number;
  readonly callerWindowEndYear: number;
}>;
export type Output = Readonly<{
  readonly coverageWeightedAtlanticAnomalyC: number;
  readonly coveredWindowYears: number;
}>;
const inputFields = [
  {
    id: "observedWindowStartsYears",
    label: "Observed window starts years",
    kind: "numberList",
  },
  {
    id: "observedWindowEndsYears",
    label: "Observed window ends years",
    kind: "numberList",
  },
  {
    id: "observedAtlanticSstAnomaliesC",
    label: "Observed atlantic sst anomalies c",
    kind: "numberList",
  },
  {
    id: "callerWindowStartYear",
    label: "Caller window start year",
    kind: "number",
  },
  {
    id: "callerWindowEndYear",
    label: "Caller window end year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observedWindowStartsYears,
    input.observedWindowEndsYears,
    "intervals",
  );
  aligned(
    input.observedWindowStartsYears,
    input.observedAtlanticSstAnomaliesC,
    "values",
  );
  strictlyIncreasing(input.observedWindowStartsYears, "starts", 1);
  ordered(input.callerWindowStartYear, input.callerWindowEndYear);
  input.observedWindowStartsYears.forEach((v, i) => {
    if (
      v >= input.observedWindowEndsYears[i] ||
      (i > 0 && v < input.observedWindowEndsYears[i - 1])
    )
      simpleError(
        "intervals",
        "Positive, disjoint explicit averaging exposures.",
      );
  });
  const durations = input.observedWindowStartsYears.map((v, i) =>
      Math.max(
        0,
        Math.min(input.observedWindowEndsYears[i], input.callerWindowEndYear) -
          Math.max(v, input.callerWindowStartYear),
      ),
    ),
    covered = sum(durations);
  positive(covered, "window coverage");
  return {
    coverageWeightedAtlanticAnomalyC:
      sum(durations.map((v, i) => v * input.observedAtlanticSstAnomaliesC[i])) /
      covered,
    coveredWindowYears: covered,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedWindowStartsYears: [2000, 2001],
  observedWindowEndsYears: [2001, 2003],
  observedAtlanticSstAnomaliesC: [1, 2],
  callerWindowStartYear: 2000,
  callerWindowEndYear: 2002,
} satisfies Input;
export const exampleOutput = {
  coverageWeightedAtlanticAnomalyC: 1.5,
  coveredWindowYears: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/atlantic-multidecadal-window-average",
  title: "Atlantic Multidecadal Window Average Calculator",
  description:
    "Overlap-duration weighted independently precomputed Atlantic anomalies with explicit source/baseline and reported observed coverage, gaps not imputed and no annual forecast. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "coverageWeightedAtlanticAnomalyC",
      label: "Coverage weighted atlantic anomaly c",
      kind: "number",
    },
    { id: "coveredWindowYears", label: "Covered window years", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedWindowStartsYears:
        value.observedWindowStartsYears as readonly number[],
      observedWindowEndsYears:
        value.observedWindowEndsYears as readonly number[],
      observedAtlanticSstAnomaliesC:
        value.observedAtlanticSstAnomaliesC as readonly number[],
      callerWindowStartYear: value.callerWindowStartYear as number,
      callerWindowEndYear: value.callerWindowEndYear as number,
    }),
});
export const run = tool.execute;
export default tool;
