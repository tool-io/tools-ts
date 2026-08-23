import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ParallelResistanceInput = {
  readonly resistances: readonly number[];
};

export type ParallelResistanceOutput = {
  readonly conductanceTotal: number;
  readonly equivalentResistance: number;
};

export const calculateParallelResistance = (
  input: ParallelResistanceInput,
): ParallelResistanceOutput => {
  if (input.resistances.length < 1)
    return simpleError(
      "resistances",
      "Provide at least one resistance.",
      "insufficient_resistances",
    );
  if (!input.resistances.every((value) => value > 0))
    return simpleError(
      "resistances",
      "Every resistance must be positive.",
      "invalid_resistance",
    );
  const conductanceTotal = input.resistances.reduce(
    (sum, value) => sum + 1 / value,
    0,
  );
  return {
    conductanceTotal,
    equivalentResistance: 1 / conductanceTotal,
  };
};

export const parallelResistanceExample = {
  input: {
    resistances: [10, 30],
  },
  output: {
    conductanceTotal: 0.13333333333333333,
    equivalentResistance: 7.5,
  },
} satisfies ToolExample<ParallelResistanceInput, ParallelResistanceOutput>;

export const parallelResistanceTool = createSimpleTool({
  id: "electricity/parallel-resistance",
  title: "Parallel Resistance Calculator",
  description:
    "Combine resistors in parallel into one equivalent resistance via reciprocal summation.",
  inputs: [
    {
      description: "Component resistances in ohms; each must be positive.",
      id: "resistances",
      kind: "numberList",
      label: "Resistances",
      unit: "ohm",
    },
  ],
  outputs: [
    {
      description: "Sum of the reciprocals of the resistances, in siemens.",
      id: "conductanceTotal",
      kind: "number",
      label: "Total conductance",
      unit: "siemens",
    },
    {
      description: "Reciprocal of the total conductance, in ohms.",
      id: "equivalentResistance",
      kind: "number",
      label: "Equivalent resistance",
      unit: "ohm",
    },
  ],
  calculate: (input) =>
    calculateParallelResistance({
      resistances: input.resistances as readonly number[],
    }),
});

export const runParallelResistance = parallelResistanceTool.execute;
export default parallelResistanceTool;
