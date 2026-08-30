import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cytosineDepths: readonly number[];
  readonly minimumDepth: number;
}>;
export type Output = Readonly<{
  readonly passingIndexes: readonly number[];
  readonly failedIndexes: readonly number[];
  readonly passingPercent: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.cytosineDepths.length === 0 ||
    input.cytosineDepths.some((v) => !Number.isSafeInteger(v) || v < 0) ||
    input.minimumDepth < 0
  )
    simpleError("cytosineDepths", "Nonnegative integer depths are required.");
  const passingIndexes = input.cytosineDepths.flatMap((v, i) =>
      v >= input.minimumDepth ? [i] : [],
    ),
    failedIndexes = input.cytosineDepths.flatMap((v, i) =>
      v < input.minimumDepth ? [i] : [],
    );
  return {
    passingIndexes,
    failedIndexes,
    passingPercent: (passingIndexes.length / input.cytosineDepths.length) * 100,
  };
};

export const exampleInput = {
  cytosineDepths: [5, 10, 20],
  minimumDepth: 10,
} satisfies Input;
export const exampleOutput = {
  passingIndexes: [1, 2],
  failedIndexes: [0],
  passingPercent: 66.66666666666666,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/wgbs-depth-filter",
  title: "WGBS Depth Filter",
  description:
    "Filter WGBS cytosine sites by a caller-supplied coverage depth.",
  inputs: [
    { id: "cytosineDepths", kind: "numberList", label: "Cytosine depths" },
    { id: "minimumDepth", kind: "number", label: "Minimum depth" },
  ],
  outputs: [
    { id: "passingIndexes", kind: "numberList", label: "Passing indexes" },
    { id: "failedIndexes", kind: "numberList", label: "Failed indexes" },
    { id: "passingPercent", kind: "number", label: "Passing percent" },
  ],
  calculate: (value) =>
    calculate({
      cytosineDepths: value.cytosineDepths as readonly number[],
      minimumDepth: value.minimumDepth as number,
    }),
});
export const run = tool.execute;
export default tool;
