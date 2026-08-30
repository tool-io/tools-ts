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
  sum,
  intervalUnion,
  span,
} from "../shared.js";
export type Input = Readonly<{
  readonly objectOwnershipYearIntervals: readonly (readonly number[])[];
  readonly callerHistoricalReviewYearBounds: readonly number[];
}>;
export type Output = Readonly<{
  readonly historicalReviewOverlapYearsByInterval: readonly number[];
  readonly overlappingIntervalIndices: readonly number[];
  readonly unionHistoricalOverlapYears: number;
}>;
const inputFields = [
  {
    id: "objectOwnershipYearIntervals",
    label: "Object ownership year intervals",
    kind: "matrix",
  },
  {
    id: "callerHistoricalReviewYearBounds",
    label: "Caller historical review year bounds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.callerHistoricalReviewYearBounds.length !== 2)
    simpleError("bounds", "Historical review endpoints required.");
  const [a, b] = input.callerHistoricalReviewYearBounds;
  positive(span(a, b, "review"), "review");
  intervalUnion(input.objectOwnershipYearIntervals);
  const x = input.objectOwnershipYearIntervals.map(([lo, hi]) =>
      Math.max(0, Math.min(b, hi) - Math.max(a, lo)),
    ),
    clipped = input.objectOwnershipYearIntervals.flatMap(([lo, hi]) =>
      Math.min(b, hi) > Math.max(a, lo)
        ? [[Math.max(a, lo), Math.min(b, hi)]]
        : [],
    ),
    total = clipped.length
      ? sum(intervalUnion(clipped).map((r) => r[1] - r[0]))
      : 0;
  return {
    historicalReviewOverlapYearsByInterval: x,
    overlappingIntervalIndices: x.flatMap((v, i) => (v > 0 ? [i] : [])),
    unionHistoricalOverlapYears: total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  objectOwnershipYearIntervals: [
    [1920, 1930],
    [1940, 1950],
  ],
  callerHistoricalReviewYearBounds: [1933, 1946],
} satisfies Input;
export const exampleOutput = {
  historicalReviewOverlapYearsByInterval: [0, 6],
  overlappingIntervalIndices: [1],
  unionHistoricalOverlapYears: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/red-flag-date-range-overlap-checker",
  title: "Nazi-Era Red Flag Date Range Overlap Checker",
  description:
    "Flag documentary intervals overlapping caller declared historical review window using half-open years and union exposure; named Nazi-era review does not itself establish theft, restitution eligibility or clear provenance.",
  inputs: inputFields,
  outputs: [
    {
      id: "historicalReviewOverlapYearsByInterval",
      label: "Historical review overlap years by interval",
      kind: "numberList",
    },
    {
      id: "overlappingIntervalIndices",
      label: "Overlapping interval indices",
      kind: "numberList",
    },
    {
      id: "unionHistoricalOverlapYears",
      label: "Union historical overlap years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      objectOwnershipYearIntervals:
        value.objectOwnershipYearIntervals as readonly (readonly number[])[],
      callerHistoricalReviewYearBounds:
        value.callerHistoricalReviewYearBounds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
