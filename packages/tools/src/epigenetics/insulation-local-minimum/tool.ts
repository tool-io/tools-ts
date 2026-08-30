import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly insulationScores: readonly number[];
  readonly minimumIndex: number;
  readonly maximumIndex: number;
}>;
export type Output = Readonly<{
  readonly localMinimumIndex: number;
  readonly localMinimumScore: number;
  readonly neighborDepth: number;
}>;

export const calculate = (input: Input): Output => {
  const n = input.insulationScores.length;
  if (
    n < 3 ||
    input.minimumIndex < 1 ||
    input.maximumIndex >= n - 1 ||
    input.minimumIndex > input.maximumIndex
  )
    simpleError(
      "minimumIndex",
      "Inspection range must have two neighbors.",
      "invalid_range",
    );
  let localMinimumIndex = input.minimumIndex;
  for (let i = input.minimumIndex + 1; i <= input.maximumIndex; i += 1)
    if (input.insulationScores[i] < input.insulationScores[localMinimumIndex])
      localMinimumIndex = i;
  const localMinimumScore = input.insulationScores[localMinimumIndex],
    neighborDepth =
      (input.insulationScores[localMinimumIndex - 1] +
        input.insulationScores[localMinimumIndex + 1]) /
        2 -
      localMinimumScore;
  return { localMinimumIndex, localMinimumScore, neighborDepth };
};

export const exampleInput = {
  insulationScores: [5, 3, 1, 4, 6],
  minimumIndex: 1,
  maximumIndex: 3,
} satisfies Input;
export const exampleOutput = {
  localMinimumIndex: 2,
  localMinimumScore: 1,
  neighborDepth: 2.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      insulationScores: input.insulationScores as readonly number[],
      minimumIndex: input.minimumIndex as number,
      maximumIndex: input.maximumIndex as number,
    }),
  description:
    "Find the lowest insulation score within an interior search range.",
  id: "epigenetics/insulation-local-minimum",
  inputs: [
    { id: "insulationScores", label: "Insulation scores", kind: "numberList" },
    {
      id: "minimumIndex",
      label: "First index to inspect",
      kind: "integer",
      minimum: 1,
    },
    {
      id: "maximumIndex",
      label: "Last index to inspect",
      kind: "integer",
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "localMinimumIndex",
      label: "Local minimum index",
      kind: "integer",
      minimum: 0,
    },
    { id: "localMinimumScore", label: "Local minimum score", kind: "number" },
    { id: "neighborDepth", label: "Mean-neighbor depth", kind: "number" },
  ],
  title: "Insulation Local Minimum",
});

export const run = tool.execute;
export default tool;
