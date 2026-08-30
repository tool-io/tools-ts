import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly expectedCounts: readonly number[];
  readonly minimumExpectedCount: number;
}>;
export type Output = Readonly<{
  readonly belowMinimumIndexes: readonly number[];
  readonly smallCellCount: number;
  readonly allCellsAdequate: boolean;
}>;
export const calculate = (input: Input): Output => {
  if (!input.expectedCounts.length)
    simpleError("expectedCounts", "Nonempty expected cell counts required.");
  input.expectedCounts.forEach((v) => nonnegative(v, "expectedCounts"));
  positive(input.minimumExpectedCount, "minimumExpectedCount");
  const belowMinimumIndexes = input.expectedCounts.flatMap((v, i) =>
    v < input.minimumExpectedCount ? [i] : [],
  );
  return {
    belowMinimumIndexes,
    smallCellCount: belowMinimumIndexes.length,
    allCellsAdequate: belowMinimumIndexes.length === 0,
  };
};
export const exampleInput = {
  expectedCounts: [10, 4, 20],
  minimumExpectedCount: 5,
} satisfies Input;
export const exampleOutput = {
  belowMinimumIndexes: [1],
  smallCellCount: 1,
  allCellsAdequate: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "genetics/expected-cell-count-audit",
  title: "Expected Cell Count Audit",
  description:
    "Audit expected contingency-cell counts against a caller-defined asymptotic adequacy criterion.",
  inputs: [
    { id: "expectedCounts", label: "Expected counts", kind: "numberList" },
    {
      id: "minimumExpectedCount",
      label: "Minimum expected count",
      kind: "number",
    },
  ],
  outputs: [
    {
      id: "belowMinimumIndexes",
      label: "Below minimum indexes",
      kind: "numberList",
    },
    { id: "smallCellCount", label: "Small cell count", kind: "number" },
    { id: "allCellsAdequate", label: "All cells adequate", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      expectedCounts: value.expectedCounts as readonly number[],
      minimumExpectedCount: value.minimumExpectedCount as number,
    }),
});
export const run = tool.execute;
export default tool;
