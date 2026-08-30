import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly totalSlots: number;
  readonly segmentWeights: readonly number[];
}>;
export type Output = Readonly<{
  readonly allocations: readonly number[];
  readonly allocatedTotal: number;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.segmentWeights.length === 0 ||
    input.segmentWeights.some((value) => value < 0)
  )
    simpleError(
      "segmentWeights",
      "Weights must be a nonempty nonnegative list.",
      "invalid_weights",
    );
  const weightTotal = input.segmentWeights.reduce(
    (total, value) => total + value,
    0,
  );
  if (weightTotal <= 0)
    simpleError(
      "segmentWeights",
      "At least one weight must be positive.",
      "zero_weight",
    );
  const exact = input.segmentWeights.map(
    (value) => (value / weightTotal) * input.totalSlots,
  );
  const allocations = exact.map(Math.floor);
  let remaining =
    input.totalSlots - allocations.reduce((total, value) => total + value, 0);
  const order = exact
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);
  for (let index = 0; index < remaining; index += 1)
    allocations[order[index].index] += 1;
  return {
    allocations,
    allocatedTotal: allocations.reduce((total, value) => total + value, 0),
  };
};

export const exampleInput = {
  totalSlots: 10,
  segmentWeights: [5, 3, 2],
} satisfies Input;
export const example = {
  input: exampleInput,
  output: calculate(exampleInput),
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  totalSlots: 1,
  segmentWeights: [1, 1, 1],
} satisfies Input;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      totalSlots: input.totalSlots as number,
      segmentWeights: input.segmentWeights as readonly number[],
    }),
  description:
    "Allocate integer audience slots proportionally with largest remainders.",
  id: "journalism/audience-segment-allocation",
  inputs: [
    {
      id: "totalSlots",
      label: "Total audience slots",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "segmentWeights",
      label: "Audience segment weights",
      kind: "numberList",
      unit: "weight",
    },
  ],
  outputs: [
    { id: "allocations", label: "Integer allocations", kind: "numberList" },
    {
      id: "allocatedTotal",
      label: "Allocated total",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Audience Segment Allocation",
});

export const run = tool.execute;
export default tool;
