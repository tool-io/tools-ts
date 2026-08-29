import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteCostPerYardInput = Readonly<{
  readonly totalCost: number;
  readonly volumeCubicYards: number;
}>;
export type ConcreteCostPerYardOutput = Readonly<{ costPerCubicYard: number }>;

export const calculateConcreteCostPerYard = (
  i: ConcreteCostPerYardInput,
): ConcreteCostPerYardOutput => {
  const value = i.totalCost / i.volumeCubicYards;
  if (!Number.isFinite(value))
    simpleError("costPerCubicYard", "The inputs produce a non-finite result.");
  return { costPerCubicYard: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { totalCost: 600, volumeCubicYards: 4 },
  output: { costPerCubicYard: 150 },
} satisfies ToolExample<ConcreteCostPerYardInput, ConcreteCostPerYardOutput>;

export const tool = createSimpleTool({
  id: "construction/concrete-cost-per-yard",
  title: "Concrete Cost Per Yard",
  description:
    "Calculate concrete material cost per cubic yard by dividing total cost by delivered cubic yards; placement labor is included only if entered in total cost.",
  inputs: [
    { id: "totalCost", kind: "number", label: "Total Cost", minimum: 0 },
    {
      id: "volumeCubicYards",
      kind: "number",
      label: "Volume (yd³)",
      unit: "yd³",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "costPerCubicYard", kind: "number", label: "Cost Per Cubic Yard" },
  ],
  calculate: (input) =>
    calculateConcreteCostPerYard({
      totalCost: input.totalCost as number,
      volumeCubicYards: input.volumeCubicYards as number,
    }),
});
export const concreteCostPerYardTool = tool;
export const runConcreteCostPerYard = tool.execute;
export default tool;
