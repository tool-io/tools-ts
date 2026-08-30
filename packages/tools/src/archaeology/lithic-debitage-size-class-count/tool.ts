import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative, ordered } from "../shared.js";
export type Input = Readonly<{
  readonly flakeMaximumDimensionsMm: readonly number[];
  readonly sizeClassLowerEdgesMm: readonly number[];
}>;
export type Output = Readonly<{
  readonly sizeClassCounts: readonly number[];
  readonly sizeClassPercentages: readonly number[];
}>;
const inputFields = [
  {
    id: "flakeMaximumDimensionsMm",
    label: "Flake maximum dimensions mm",
    kind: "numberList",
  },
  {
    id: "sizeClassLowerEdgesMm",
    label: "Size class lower edges mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.flakeMaximumDimensionsMm.forEach((v) =>
    nonnegative(v, "flakeMaximumDimensionsMm"),
  );
  input.sizeClassLowerEdgesMm.forEach((v) =>
    nonnegative(v, "sizeClassLowerEdgesMm"),
  );
  ordered(input.sizeClassLowerEdgesMm, "sizeClassLowerEdgesMm");
  if (
    input.sizeClassLowerEdgesMm[0] !== 0 ||
    !input.flakeMaximumDimensionsMm.length
  )
    simpleError(
      "classes",
      "Nonempty measurements and first lower edge zero required; final bin is open-ended.",
    );
  const sizeClassCounts = Array<number>(
    input.sizeClassLowerEdgesMm.length,
  ).fill(0);
  input.flakeMaximumDimensionsMm.forEach((v) => {
    let low = 0,
      high = input.sizeClassLowerEdgesMm.length;
    while (low + 1 < high) {
      const m = Math.floor((low + high) / 2);
      if (input.sizeClassLowerEdgesMm[m] <= v) low = m;
      else high = m;
    }
    sizeClassCounts[low]++;
  });
  return {
    sizeClassCounts,
    sizeClassPercentages: sizeClassCounts.map(
      (v) => (100 * v) / input.flakeMaximumDimensionsMm.length,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  flakeMaximumDimensionsMm: [1, 5, 10, 20],
  sizeClassLowerEdgesMm: [0, 5, 10],
} satisfies Input;
export const exampleOutput = {
  sizeClassCounts: [1, 1, 2],
  sizeClassPercentages: [25, 25, 50],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/lithic-debitage-size-class-count",
  title: "Lithic Debitage Size Class Count Tool",
  description:
    "Bin measured flake maximum dimension into explicit half-open lower-edge classes with an open-ended last bin; exact boundaries enter the higher class and manufacture stages are not inferred.",
  inputs: inputFields,
  outputs: [
    { id: "sizeClassCounts", label: "Size class counts", kind: "numberList" },
    {
      id: "sizeClassPercentages",
      label: "Size class percentages",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      flakeMaximumDimensionsMm:
        value.flakeMaximumDimensionsMm as readonly number[],
      sizeClassLowerEdgesMm: value.sizeClassLowerEdgesMm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
