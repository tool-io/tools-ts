import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteYieldInput = Readonly<{
  readonly batchMassKg: number;
  readonly freshDensityKgPerCubicMeter: number;
}>;
export type ConcreteYieldOutput = Readonly<{ yieldCubicMeters: number }>;

export const calculateConcreteYield = (
  i: ConcreteYieldInput,
): ConcreteYieldOutput => {
  const value = i.batchMassKg / i.freshDensityKgPerCubicMeter;
  if (!Number.isFinite(value))
    simpleError("yieldCubicMeters", "The inputs produce a non-finite result.");
  return { yieldCubicMeters: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { batchMassKg: 4800, freshDensityKgPerCubicMeter: 2400 },
  output: { yieldCubicMeters: 2 },
} satisfies ToolExample<ConcreteYieldInput, ConcreteYieldOutput>;

export const tool = createSimpleTool({
  id: "construction/concrete-yield",
  title: "Concrete Yield",
  description:
    "Calculate fresh concrete batch yield as total batch mass divided by measured fresh density, both from the same batch.",
  inputs: [
    {
      id: "batchMassKg",
      kind: "number",
      label: "Batch Mass (kg)",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "freshDensityKgPerCubicMeter",
      kind: "number",
      label: "Fresh Density (kg/m³)",
      unit: "kg/m³",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    { id: "yieldCubicMeters", kind: "number", label: "Yield (m³)", unit: "m³" },
  ],
  calculate: (input) =>
    calculateConcreteYield({
      batchMassKg: input.batchMassKg as number,
      freshDensityKgPerCubicMeter: input.freshDensityKgPerCubicMeter as number,
    }),
});
export const concreteYieldTool = tool;
export const runConcreteYield = tool.execute;
export default tool;
