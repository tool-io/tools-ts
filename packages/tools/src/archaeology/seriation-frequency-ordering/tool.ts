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
  count,
  aligned,
  ordered,
  shape,
  ids,
} from "../shared.js";
export type Input = Readonly<{
  readonly assemblageTypeCounts: readonly (readonly number[])[];
  readonly typeAxisCoordinates: readonly number[];
  readonly assemblageIds: readonly number[];
}>;
export type Output = Readonly<{
  readonly frequencyCentroidCoordinates: readonly number[];
  readonly orderedAssemblageIds: readonly number[];
}>;
const inputFields = [
  {
    id: "assemblageTypeCounts",
    label: "Assemblage type counts",
    kind: "matrix",
  },
  {
    id: "typeAxisCoordinates",
    label: "Type axis coordinates",
    kind: "numberList",
  },
  { id: "assemblageIds", label: "Assemblage ids", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.typeAxisCoordinates.forEach((v) =>
    nonnegative(v, "typeAxisCoordinates"),
  );
  const m = shape(input.assemblageTypeCounts, "assemblageTypeCounts");
  ids(input.assemblageIds, "assemblageIds");
  aligned(input.assemblageTypeCounts, input.assemblageIds, "assemblageIds");
  if (input.typeAxisCoordinates.length !== m)
    simpleError(
      "typeAxisCoordinates",
      "One caller type-axis coordinate per column required.",
    );
  ordered(input.typeAxisCoordinates, "typeAxisCoordinates");
  const frequencyCentroidCoordinates = input.assemblageTypeCounts.map((row) => {
      row.forEach((v) => count(v, "assemblageTypeCounts"));
      const total = positive(
        row.reduce((a, b) => a + b, 0),
        "assemblageTypeCounts",
      );
      return row.reduce(
        (s, v, j) => s + (v * input.typeAxisCoordinates[j]) / total,
        0,
      );
    }),
    order = input.assemblageIds
      .map((_, i) => i)
      .sort(
        (a, b) =>
          frequencyCentroidCoordinates[a] - frequencyCentroidCoordinates[b] ||
          a - b,
      );
  return {
    frequencyCentroidCoordinates,
    orderedAssemblageIds: order.map((i) => input.assemblageIds[i]),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  assemblageTypeCounts: [
    [10, 0, 0],
    [0, 0, 10],
    [0, 10, 0],
  ],
  typeAxisCoordinates: [0, 1, 2],
  assemblageIds: [10, 20, 30],
} satisfies Input;
export const exampleOutput = {
  frequencyCentroidCoordinates: [0, 2, 1],
  orderedAssemblageIds: [10, 30, 20],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/seriation-frequency-ordering",
  title: "Seriation Frequency Ordering Tool",
  description:
    "Produce deterministic type-frequency centroid seriation on a supplied type axis, input order breaking ties; not an optimal unimodal or independently dated ordering.",
  inputs: inputFields,
  outputs: [
    {
      id: "frequencyCentroidCoordinates",
      label: "Frequency centroid coordinates",
      kind: "numberList",
    },
    {
      id: "orderedAssemblageIds",
      label: "Ordered assemblage ids",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      assemblageTypeCounts:
        value.assemblageTypeCounts as readonly (readonly number[])[],
      typeAxisCoordinates: value.typeAxisCoordinates as readonly number[],
      assemblageIds: value.assemblageIds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
