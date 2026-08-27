import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SaltToleranceIndexInput = {
  readonly controlYieldKg: number;
  readonly stressYieldKg: number;
};

export type SaltToleranceIndexOutput = {
  readonly saltToleranceIndexPercent: number;
};

export const saltToleranceIndexExample = {
  input: { controlYieldKg: 8000, stressYieldKg: 4000 },
  output: { saltToleranceIndexPercent: 50 },
} satisfies ToolExample<SaltToleranceIndexInput, SaltToleranceIndexOutput>;

export const saltToleranceIndexTool = createSimpleTool({
  id: "biology/salt-tolerance-index",
  title: "Salt Tolerance Index",
  description:
    "Compute the salt tolerance index as stressed yield divided by control yield times one hundred.",
  inputs: [
    {
      description: "Control yield in kilograms; must be greater than zero.",
      id: "controlYieldKg",
      kind: "number",
      label: "Control yield",
      unit: "kg",
    },
    {
      description: "Saline-stressed yield in kilograms; must not be negative.",
      id: "stressYieldKg",
      kind: "number",
      label: "Stressed yield",
      minimum: 0,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Salt tolerance index percentage.",
      id: "saltToleranceIndexPercent",
      kind: "number",
      label: "Salt tolerance index",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const controlYieldKg = input.controlYieldKg as number;
    const stressYieldKg = input.stressYieldKg as number;
    if (!(controlYieldKg > 0))
      simpleError(
        "controlYieldKg",
        "The control yield must be greater than zero.",
      );
    return {
      saltToleranceIndexPercent: (stressYieldKg / controlYieldKg) * 100,
    };
  },
});
export const runSaltToleranceIndex = saltToleranceIndexTool.execute;
export default saltToleranceIndexTool;
