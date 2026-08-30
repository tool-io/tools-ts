import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fragmentLengthsBp: readonly number[];
  readonly minimumBp: number;
  readonly maximumBp: number;
}>;
export type Output = Readonly<{
  readonly retainedIndexes: readonly number[];
  readonly excludedIndexes: readonly number[];
  readonly retainedPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.fragmentLengthsBp.length === 0 ||
    input.minimumBp > input.maximumBp ||
    input.fragmentLengthsBp.some((v) => v < 0)
  )
    simpleError(
      "fragmentLengthsBp",
      "Nonnegative lengths and ordered bounds are required.",
    );
  const retainedIndexes = input.fragmentLengthsBp.flatMap((v, i) =>
      v >= input.minimumBp && v <= input.maximumBp ? [i] : [],
    ),
    excludedIndexes = input.fragmentLengthsBp.flatMap((v, i) =>
      v < input.minimumBp || v > input.maximumBp ? [i] : [],
    );
  return {
    retainedIndexes,
    excludedIndexes,
    retainedPercent:
      (retainedIndexes.length / input.fragmentLengthsBp.length) * 100,
  };
};

export const exampleInput = {
  fragmentLengthsBp: [40, 100, 300],
  minimumBp: 50,
  maximumBp: 250,
} satisfies Input;
export const exampleOutput = {
  retainedIndexes: [1],
  excludedIndexes: [0, 2],
  retainedPercent: 33.33333333333333,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/rrbs-fragment-range",
  title: "RRBS Fragment Range",
  description: "Filter RRBS fragment lengths against selected size bounds.",
  inputs: [
    {
      id: "fragmentLengthsBp",
      kind: "numberList",
      label: "Fragment lengths bp",
    },
    { id: "minimumBp", kind: "number", label: "Minimum bp" },
    { id: "maximumBp", kind: "number", label: "Maximum bp" },
  ],
  outputs: [
    { id: "retainedIndexes", kind: "numberList", label: "Retained indexes" },
    { id: "excludedIndexes", kind: "numberList", label: "Excluded indexes" },
    { id: "retainedPercent", kind: "number", label: "Retained percent" },
  ],
  calculate: (value) =>
    calculate({
      fragmentLengthsBp: value.fragmentLengthsBp as readonly number[],
      minimumBp: value.minimumBp as number,
      maximumBp: value.maximumBp as number,
    }),
});
export const run = tool.execute;
export default tool;
