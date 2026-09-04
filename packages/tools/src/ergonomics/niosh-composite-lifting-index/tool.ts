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
  fraction,
  aligned,
  sum,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerOrderedSingleTaskIndices: readonly number[];
  readonly callerOrderedFrequencyIndependentIndices: readonly number[];
  readonly callerPriorCumulativeFrequencyMultipliers: readonly number[];
  readonly callerNewCumulativeFrequencyMultipliers: readonly number[];
}>;
export type Output = Readonly<{ readonly compositeLiftingIndex: number }>;
const inputFields = [
  {
    id: "callerOrderedSingleTaskIndices",
    label: "Caller ordered single task indices",
    kind: "numberList",
  },
  {
    id: "callerOrderedFrequencyIndependentIndices",
    label: "Caller ordered frequency independent indices",
    kind: "numberList",
  },
  {
    id: "callerPriorCumulativeFrequencyMultipliers",
    label: "Caller prior cumulative frequency multipliers",
    kind: "numberList",
  },
  {
    id: "callerNewCumulativeFrequencyMultipliers",
    label: "Caller new cumulative frequency multipliers",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.callerPriorCumulativeFrequencyMultipliers.forEach((v) =>
    positive(v, "callerPriorCumulativeFrequencyMultipliers"),
  );
  input.callerNewCumulativeFrequencyMultipliers.forEach((v) =>
    positive(v, "callerNewCumulativeFrequencyMultipliers"),
  );
  input.callerOrderedSingleTaskIndices.forEach((v) =>
    nonnegative(v, "callerOrderedSingleTaskIndices"),
  );
  input.callerOrderedFrequencyIndependentIndices.forEach((v) =>
    nonnegative(v, "callerOrderedFrequencyIndependentIndices"),
  );
  aligned(
    input.callerOrderedSingleTaskIndices,
    input.callerOrderedFrequencyIndependentIndices,
    "callerOrderedSingleTaskIndices",
  );
  aligned(
    input.callerOrderedSingleTaskIndices,
    input.callerPriorCumulativeFrequencyMultipliers,
    "callerOrderedSingleTaskIndices",
  );
  aligned(
    input.callerOrderedSingleTaskIndices,
    input.callerNewCumulativeFrequencyMultipliers,
    "callerOrderedSingleTaskIndices",
  );
  if (input.callerOrderedSingleTaskIndices.length > 128)
    simpleError("tasks", "≤128 independently ranked CLI tasks.");
  input.callerOrderedSingleTaskIndices.forEach((v, i) => {
    if (i && v > input.callerOrderedSingleTaskIndices[i - 1])
      simpleError("order", "Descending independently computed STLI order.");
    fraction(input.callerPriorCumulativeFrequencyMultipliers[i], "FM prior");
    fraction(input.callerNewCumulativeFrequencyMultipliers[i], "FM new");
    if (
      input.callerNewCumulativeFrequencyMultipliers[i] >
      input.callerPriorCumulativeFrequencyMultipliers[i]
    )
      simpleError("FM", "New cumulative FM≤prior.");
  });
  return {
    compositeLiftingIndex:
      input.callerOrderedSingleTaskIndices[0] +
      sum(
        input.callerOrderedFrequencyIndependentIndices.slice(1).map((v, j) => {
          const i = j + 1;
          return (
            v *
            (1 / input.callerNewCumulativeFrequencyMultipliers[i] -
              1 / input.callerPriorCumulativeFrequencyMultipliers[i])
          );
        }),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerOrderedSingleTaskIndices: [2, 1],
  callerOrderedFrequencyIndependentIndices: [1, 0.5],
  callerPriorCumulativeFrequencyMultipliers: [1, 1],
  callerNewCumulativeFrequencyMultipliers: [1, 0.5],
} satisfies Input;
export const exampleOutput = { compositeLiftingIndex: 2.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/niosh-composite-lifting-index",
  title: "NIOSH Composite Lifting Index CLI Calculator",
  description:
    "Ordered RNLE multitask CLI=STLI1+sumFILIi(1/FM new−1/FM prior); caller independently computes appropriate combined-frequency tables/ranking, not sum of single indices. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "compositeLiftingIndex",
      label: "Composite lifting index",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerOrderedSingleTaskIndices:
        value.callerOrderedSingleTaskIndices as readonly number[],
      callerOrderedFrequencyIndependentIndices:
        value.callerOrderedFrequencyIndependentIndices as readonly number[],
      callerPriorCumulativeFrequencyMultipliers:
        value.callerPriorCumulativeFrequencyMultipliers as readonly number[],
      callerNewCumulativeFrequencyMultipliers:
        value.callerNewCumulativeFrequencyMultipliers as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
