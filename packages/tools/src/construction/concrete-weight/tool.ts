import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteWeightInput = Readonly<{
  readonly volumeCubicMeters: number;
  readonly densityKgPerCubicMeter: number;
}>;
export type ConcreteWeightOutput = Readonly<{ massKg: number }>;

export const calculateConcreteWeight = (
  i: ConcreteWeightInput,
): ConcreteWeightOutput => {
  const value = i.volumeCubicMeters * i.densityKgPerCubicMeter;
  if (!Number.isFinite(value))
    simpleError("massKg", "The inputs produce a non-finite result.");
  return { massKg: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { volumeCubicMeters: 2, densityKgPerCubicMeter: 2400 },
  output: { massKg: 4800 },
} satisfies ToolExample<ConcreteWeightInput, ConcreteWeightOutput>;

export const tool = createSimpleTool({
  id: "construction/concrete-weight",
  title: "Concrete Weight",
  description:
    "Calculate concrete mass from placed volume and supplied fresh-concrete density; mix density varies with aggregate and air content.",
  inputs: [
    {
      id: "volumeCubicMeters",
      kind: "number",
      label: "Volume (m³)",
      unit: "m³",
      minimum: 0,
    },
    {
      id: "densityKgPerCubicMeter",
      kind: "number",
      label: "Density (kg/m³)",
      unit: "kg/m³",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "massKg", kind: "number", label: "Mass (kg)", unit: "kg" }],
  calculate: (input) =>
    calculateConcreteWeight({
      volumeCubicMeters: input.volumeCubicMeters as number,
      densityKgPerCubicMeter: input.densityKgPerCubicMeter as number,
    }),
});
export const concreteWeightTool = tool;
export const runConcreteWeight = tool.execute;
export default tool;
