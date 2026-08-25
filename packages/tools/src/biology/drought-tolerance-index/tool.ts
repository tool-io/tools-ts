import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DroughtToleranceIndexInput = {
  readonly controlYieldKg: number;
  readonly stressYieldKg: number;
};

export type DroughtToleranceIndexOutput = {
  readonly droughtToleranceIndexPercent: number;
};

export const droughtToleranceIndexExample = {
  input: { controlYieldKg: 5000, stressYieldKg: 3500 },
  output: { droughtToleranceIndexPercent: 70 },
} satisfies ToolExample<
  DroughtToleranceIndexInput,
  DroughtToleranceIndexOutput
>;

export const droughtToleranceIndexTool = createSimpleTool({
  id: "biology/drought-tolerance-index",
  title: "Drought Tolerance Index",
  description:
    "Compute the drought tolerance index as stressed yield divided by control yield times one hundred.",
  inputs: [
    {
      description: "Control yield in kilograms; must be greater than zero.",
      id: "controlYieldKg",
      kind: "number",
      label: "Control yield",
      unit: "kg",
    },
    {
      description: "Stressed yield in kilograms; must not be negative.",
      id: "stressYieldKg",
      kind: "number",
      label: "Stressed yield",
      minimum: 0,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Drought tolerance index percentage.",
      id: "droughtToleranceIndexPercent",
      kind: "number",
      label: "Drought tolerance index",
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
      droughtToleranceIndexPercent: (stressYieldKg / controlYieldKg) * 100,
    };
  },
});
export const runDroughtToleranceIndex = droughtToleranceIndexTool.execute;
export default droughtToleranceIndexTool;
