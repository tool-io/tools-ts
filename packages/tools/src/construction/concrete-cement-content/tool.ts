import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteCementContentInput = Readonly<{
  readonly cementMassKg: number;
  readonly concreteVolumeCubicMeters: number;
}>;
export type ConcreteCementContentOutput = Readonly<{
  cementContentKgPerCubicMeter: number;
}>;

export const calculateConcreteCementContent = (
  i: ConcreteCementContentInput,
): ConcreteCementContentOutput => {
  const value = i.cementMassKg / i.concreteVolumeCubicMeters;
  if (!Number.isFinite(value))
    simpleError(
      "cementContentKgPerCubicMeter",
      "The inputs produce a non-finite result.",
    );
  return { cementContentKgPerCubicMeter: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { cementMassKg: 350, concreteVolumeCubicMeters: 1 },
  output: { cementContentKgPerCubicMeter: 350 },
} satisfies ToolExample<
  ConcreteCementContentInput,
  ConcreteCementContentOutput
>;

export const tool = createSimpleTool({
  id: "construction/concrete-cement-content",
  title: "Concrete Cement Content",
  description:
    "Calculate cement content as cement mass divided by yielded concrete volume in kilograms per cubic meter.",
  inputs: [
    {
      id: "cementMassKg",
      kind: "number",
      label: "Cement Mass (kg)",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "concreteVolumeCubicMeters",
      kind: "number",
      label: "Concrete Volume (m³)",
      unit: "m³",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "cementContentKgPerCubicMeter",
      kind: "number",
      label: "Cement Content (kg/m³)",
      unit: "kg/m³",
    },
  ],
  calculate: (input) =>
    calculateConcreteCementContent({
      cementMassKg: input.cementMassKg as number,
      concreteVolumeCubicMeters: input.concreteVolumeCubicMeters as number,
    }),
});
export const concreteCementContentTool = tool;
export const runConcreteCementContent = tool.execute;
export default tool;
