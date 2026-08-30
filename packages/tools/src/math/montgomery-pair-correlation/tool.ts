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
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly orderedPositiveZeroOrdinates: readonly number[];
  readonly callerMeanSpacing: number;
  readonly normalizedGapLowerBound: number;
  readonly normalizedGapUpperBound: number;
}>;
export type Output = Readonly<{
  readonly observedUnorderedPairCountInBand: number;
  readonly pairsPerSuppliedOrdinate: number;
  readonly totalComparedPairs: number;
}>;
const inputFields = [
  {
    id: "orderedPositiveZeroOrdinates",
    label: "Ordered positive zero ordinates",
    kind: "numberList",
  },
  { id: "callerMeanSpacing", label: "Caller mean spacing", kind: "number" },
  {
    id: "normalizedGapLowerBound",
    label: "Normalized gap lower bound",
    kind: "number",
  },
  {
    id: "normalizedGapUpperBound",
    label: "Normalized gap upper bound",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.orderedPositiveZeroOrdinates.forEach((v) =>
    positive(v, "orderedPositiveZeroOrdinates"),
  );
  positive(input.callerMeanSpacing, "callerMeanSpacing");
  nonnegative(input.normalizedGapLowerBound, "normalizedGapLowerBound");
  nonnegative(input.normalizedGapUpperBound, "normalizedGapUpperBound");
  ordered(input.orderedPositiveZeroOrdinates, "ordinates");
  if (
    input.orderedPositiveZeroOrdinates.length > 1000 ||
    input.normalizedGapUpperBound <= input.normalizedGapLowerBound
  )
    simpleError(
      "pairs",
      "At most 1000 ordinates and positive-width half-open normalized band required.",
    );
  const t = input.orderedPositiveZeroOrdinates;
  let n = 0;
  for (let i = 0; i < t.length; i++)
    for (let j = i + 1; j < t.length; j++) {
      const d = (t[j] - t[i]) / input.callerMeanSpacing;
      if (
        d >= input.normalizedGapLowerBound &&
        d < input.normalizedGapUpperBound
      )
        n++;
    }
  return {
    observedUnorderedPairCountInBand: n,
    pairsPerSuppliedOrdinate: n / t.length,
    totalComparedPairs: (t.length * (t.length - 1)) / 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  orderedPositiveZeroOrdinates: [10, 12, 15],
  callerMeanSpacing: 2,
  normalizedGapLowerBound: 0,
  normalizedGapUpperBound: 2,
} satisfies Input;
export const exampleOutput = {
  observedUnorderedPairCountInBand: 2,
  pairsPerSuppliedOrdinate: 0.6666666666666666,
  totalComparedPairs: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/montgomery-pair-correlation",
  title: "Montgomery Pair Correlation Calculator",
  description:
    "Compute finite supplied-ordinate pair-gap histogram normalized by caller mean spacing, counting unordered i<j pairs once; does not verify ordinates are zeta zeros or prove Montgomery asymptotic pair correlation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedUnorderedPairCountInBand",
      label: "Observed unordered pair count in band",
      kind: "number",
    },
    {
      id: "pairsPerSuppliedOrdinate",
      label: "Pairs per supplied ordinate",
      kind: "number",
    },
    { id: "totalComparedPairs", label: "Total compared pairs", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      orderedPositiveZeroOrdinates:
        value.orderedPositiveZeroOrdinates as readonly number[],
      callerMeanSpacing: value.callerMeanSpacing as number,
      normalizedGapLowerBound: value.normalizedGapLowerBound as number,
      normalizedGapUpperBound: value.normalizedGapUpperBound as number,
    }),
});
export const run = tool.execute;
export default tool;
