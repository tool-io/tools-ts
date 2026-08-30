import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly tadBoundaryPositionsBp: readonly number[];
}>;
export type Output = Readonly<{
  readonly adjacentDistancesBp: readonly number[];
  readonly meanDistanceBp: number;
  readonly minimumDistanceBp: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.tadBoundaryPositionsBp.length < 2 ||
    input.tadBoundaryPositionsBp.some(
      (v, i) => i > 0 && v <= input.tadBoundaryPositionsBp[i - 1],
    )
  )
    simpleError(
      "tadBoundaryPositionsBp",
      "At least two increasing boundaries are required.",
      "invalid_boundaries",
    );
  const adjacentDistancesBp = input.tadBoundaryPositionsBp
    .slice(1)
    .map((v, i) => v - input.tadBoundaryPositionsBp[i]);
  return {
    adjacentDistancesBp,
    meanDistanceBp:
      adjacentDistancesBp.reduce((a, b) => a + b, 0) /
      adjacentDistancesBp.length,
    minimumDistanceBp: Math.min(...adjacentDistancesBp),
  };
};

export const exampleInput = {
  tadBoundaryPositionsBp: [0, 100, 300],
} satisfies Input;
export const exampleOutput = {
  adjacentDistancesBp: [100, 200],
  meanDistanceBp: 150,
  minimumDistanceBp: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      tadBoundaryPositionsBp: input.tadBoundaryPositionsBp as readonly number[],
    }),
  description: "Measure adjacent TAD boundary distances.",
  id: "epigenetics/tad-boundary-distance",
  inputs: [
    {
      id: "tadBoundaryPositionsBp",
      label: "TAD boundary positions",
      kind: "numberList",
      unit: "bp",
    },
  ],
  outputs: [
    {
      id: "adjacentDistancesBp",
      label: "Adjacent boundary distances",
      kind: "numberList",
      unit: "bp",
    },
    {
      id: "meanDistanceBp",
      label: "Mean TAD boundary distance",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
    {
      id: "minimumDistanceBp",
      label: "Minimum boundary distance",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
  ],
  title: "TAD Boundary Distance",
});

export const run = tool.execute;
export default tool;
