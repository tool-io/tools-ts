import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NitrogenUseEfficiencyInput = {
  readonly grainYieldKg: number;
  readonly nitrogenAppliedKg: number;
};

export type NitrogenUseEfficiencyOutput = {
  readonly nitrogenUseEfficiency: number;
};

export const nitrogenUseEfficiencyExample = {
  input: { grainYieldKg: 5000, nitrogenAppliedKg: 100 },
  output: { nitrogenUseEfficiency: 50 },
} satisfies ToolExample<
  NitrogenUseEfficiencyInput,
  NitrogenUseEfficiencyOutput
>;

export const nitrogenUseEfficiencyTool = createSimpleTool({
  id: "biology/nitrogen-use-efficiency",
  title: "NUE Calculator",
  description:
    "Compute nitrogen use efficiency as grain yield in kilograms divided by nitrogen applied in kilograms.",
  inputs: [
    {
      description: "Grain yield in kilograms; must be greater than zero.",
      id: "grainYieldKg",
      kind: "number",
      label: "Grain yield",
      unit: "kg",
    },
    {
      description: "Nitrogen applied in kilograms; must be greater than zero.",
      id: "nitrogenAppliedKg",
      kind: "number",
      label: "Nitrogen applied",
      unit: "kg",
    },
  ],
  outputs: [
    {
      description:
        "Kilograms of grain produced per kilogram of nitrogen applied.",
      id: "nitrogenUseEfficiency",
      kind: "number",
      label: "Nitrogen use efficiency",
      unit: "kg/kg",
    },
  ],
  calculate: (input) => {
    const grainYieldKg = input.grainYieldKg as number;
    const nitrogenAppliedKg = input.nitrogenAppliedKg as number;
    if (!(grainYieldKg > 0))
      simpleError("grainYieldKg", "The grain yield must be greater than zero.");
    if (!(nitrogenAppliedKg > 0))
      simpleError(
        "nitrogenAppliedKg",
        "The nitrogen applied must be greater than zero.",
      );
    return { nitrogenUseEfficiency: grainYieldKg / nitrogenAppliedKg };
  },
});
export const runNitrogenUseEfficiency = nitrogenUseEfficiencyTool.execute;
export default nitrogenUseEfficiencyTool;
