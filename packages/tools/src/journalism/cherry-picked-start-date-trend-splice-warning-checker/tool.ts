import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  aligned,
  slope,
  sequence,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly observationTimes: readonly number[];
  readonly observedValues: readonly number[];
  readonly callerSelectedStartIndex: number;
  readonly callerSelectedEndIndex: number;
}>;
export type Output = Readonly<{
  readonly fullSeriesLinearSlope: number;
  readonly selectedWindowLinearSlope: number;
  readonly signedSelectedMinusFullSlope: number;
  readonly opposedSlopeSigns: boolean;
}>;
const inputFields = [
  { id: "observationTimes", label: "Observation times", kind: "numberList" },
  { id: "observedValues", label: "Observed values", kind: "numberList" },
  {
    id: "callerSelectedStartIndex",
    label: "Caller selected start index",
    kind: "number",
  },
  {
    id: "callerSelectedEndIndex",
    label: "Caller selected end index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.observationTimes, input.observedValues, "observationTimes");
  sequence(input.observationTimes, "times");
  if (
    input.observationTimes.some(
      (v, i) => i > 0 && v === input.observationTimes[i - 1],
    )
  )
    simpleError("times", "Strictly increasing observation times required.");
  bounded(
    input.callerSelectedStartIndex,
    "start",
    0,
    input.observationTimes.length - 2,
  );
  bounded(
    input.callerSelectedEndIndex,
    "end",
    input.callerSelectedStartIndex + 1,
    input.observationTimes.length - 1,
  );
  const full = slope(input.observationTimes, input.observedValues),
    selected = slope(
      input.observationTimes.slice(
        input.callerSelectedStartIndex,
        input.callerSelectedEndIndex + 1,
      ),
      input.observedValues.slice(
        input.callerSelectedStartIndex,
        input.callerSelectedEndIndex + 1,
      ),
    );
  return {
    fullSeriesLinearSlope: full,
    selectedWindowLinearSlope: selected,
    signedSelectedMinusFullSlope: selected - full,
    opposedSlopeSigns:
      full !== 0 && selected !== 0 && Math.sign(full) !== Math.sign(selected),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationTimes: [0, 1, 2, 3],
  observedValues: [0, 10, 10, 0],
  callerSelectedStartIndex: 0,
  callerSelectedEndIndex: 1,
} satisfies Input;
export const exampleOutput = {
  fullSeriesLinearSlope: 0,
  selectedWindowLinearSlope: 10,
  signedSelectedMinusFullSlope: 10,
  opposedSlopeSigns: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/cherry-picked-start-date-trend-splice-warning-checker",
  title: "Cherry Picked Start Date Trend Splice Warning Checker",
  description:
    "Audit actual selected trend window versus full observed series OLS slope with signed difference and opposition witness; no causal inference, automatic cherry-picking intent diagnosis, seasonality adjustment or guarantee full window is appropriate.",
  inputs: inputFields,
  outputs: [
    {
      id: "fullSeriesLinearSlope",
      label: "Full series linear slope",
      kind: "number",
    },
    {
      id: "selectedWindowLinearSlope",
      label: "Selected window linear slope",
      kind: "number",
    },
    {
      id: "signedSelectedMinusFullSlope",
      label: "Signed selected minus full slope",
      kind: "number",
    },
    { id: "opposedSlopeSigns", label: "Opposed slope signs", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      observationTimes: value.observationTimes as readonly number[],
      observedValues: value.observedValues as readonly number[],
      callerSelectedStartIndex: value.callerSelectedStartIndex as number,
      callerSelectedEndIndex: value.callerSelectedEndIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
