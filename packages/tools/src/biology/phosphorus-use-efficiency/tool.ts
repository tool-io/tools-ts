import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PhosphorusUseEfficiencyInput = {
  readonly phosphorusAppliedKg: number;
  readonly yieldKg: number;
};

export type PhosphorusUseEfficiencyOutput = {
  readonly phosphorusUseEfficiency: number;
};

export const phosphorusUseEfficiencyExample = {
  input: { phosphorusAppliedKg: 30, yieldKg: 3000 },
  output: { phosphorusUseEfficiency: 100 },
} satisfies ToolExample<
  PhosphorusUseEfficiencyInput,
  PhosphorusUseEfficiencyOutput
>;

export const phosphorusUseEfficiencyTool = createSimpleTool({
  id: "biology/phosphorus-use-efficiency",
  title: "PUE Calculator",
  description:
    "Compute phosphorus use efficiency as yield in kilograms divided by phosphorus applied in kilograms.",
  inputs: [
    {
      description:
        "Phosphorus applied in kilograms; must be greater than zero.",
      id: "phosphorusAppliedKg",
      kind: "number",
      label: "Phosphorus applied",
      unit: "kg",
    },
    {
      description: "Harvested yield in kilograms; must be greater than zero.",
      id: "yieldKg",
      kind: "number",
      label: "Yield",
      unit: "kg",
    },
  ],
  outputs: [
    {
      description:
        "Kilograms of yield produced per kilogram of phosphorus applied.",
      id: "phosphorusUseEfficiency",
      kind: "number",
      label: "Phosphorus use efficiency",
      unit: "kg/kg",
    },
  ],
  calculate: (input) => {
    const phosphorusAppliedKg = input.phosphorusAppliedKg as number;
    const yieldKg = input.yieldKg as number;
    if (!(phosphorusAppliedKg > 0))
      simpleError(
        "phosphorusAppliedKg",
        "The phosphorus applied must be greater than zero.",
      );
    if (!(yieldKg > 0))
      simpleError("yieldKg", "The yield must be greater than zero.");
    return { phosphorusUseEfficiency: yieldKg / phosphorusAppliedKg };
  },
});
export const runPhosphorusUseEfficiency = phosphorusUseEfficiencyTool.execute;
export default phosphorusUseEfficiencyTool;
