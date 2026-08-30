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
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly occurrencePositionsM: readonly number[];
  readonly positionSigmasM: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedRangeExtentM: number;
  readonly earliestObservedPositionM: number;
  readonly latestObservedPositionM: number;
  readonly independentEndpointExtentSigmaM: number;
}>;
const inputFields = [
  {
    id: "occurrencePositionsM",
    label: "Occurrence positions m",
    kind: "numberList",
  },
  { id: "positionSigmasM", label: "Position sigmas m", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.positionSigmasM.forEach((v) => nonnegative(v, "positionSigmasM"));
  aligned(
    input.occurrencePositionsM,
    input.positionSigmasM,
    "occurrencePositionsM",
  );
  if (input.occurrencePositionsM.length < 2)
    simpleError("occurrences", "At least two observations required.");
  const lo = minimum(input.occurrencePositionsM),
    hi = maximum(input.occurrencePositionsM),
    a = input.occurrencePositionsM.indexOf(lo),
    b = input.occurrencePositionsM.indexOf(hi);
  return {
    observedRangeExtentM: hi - lo,
    earliestObservedPositionM: lo,
    latestObservedPositionM: hi,
    independentEndpointExtentSigmaM: Math.hypot(
      input.positionSigmasM[a],
      input.positionSigmasM[b],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  occurrencePositionsM: [10, 20, 30],
  positionSigmasM: [1, 2, 3],
} satisfies Input;
export const exampleOutput = {
  observedRangeExtentM: 20,
  earliestObservedPositionM: 10,
  latestObservedPositionM: 30,
  independentEndpointExtentSigmaM: 3.1622776601683795,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/stratigraphic-range-extent",
  title: "Stratigraphic Range Extent",
  description:
    "Summarize observed section-position span and endpoint measurement uncertainty, not true taxon duration; positions share a caller increasing chronological/section convention.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedRangeExtentM",
      label: "Observed range extent m",
      kind: "number",
    },
    {
      id: "earliestObservedPositionM",
      label: "Earliest observed position m",
      kind: "number",
    },
    {
      id: "latestObservedPositionM",
      label: "Latest observed position m",
      kind: "number",
    },
    {
      id: "independentEndpointExtentSigmaM",
      label: "Independent endpoint extent sigma m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      occurrencePositionsM: value.occurrencePositionsM as readonly number[],
      positionSigmasM: value.positionSigmasM as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
