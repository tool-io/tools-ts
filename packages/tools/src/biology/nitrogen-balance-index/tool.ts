import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type NitrogenBalanceIndexInput = {
  readonly grainProteinPercent: number;
  readonly nitrogenAppliedKg: number;
  readonly yieldKg: number;
};

export type NitrogenBalanceIndexOutput = {
  readonly nitrogenBalanceIndex: number;
};

export const nitrogenBalanceIndexExample = {
  input: { grainProteinPercent: 12, nitrogenAppliedKg: 100, yieldKg: 5000 },
  output: { nitrogenBalanceIndex: 6 },
} satisfies ToolExample<NitrogenBalanceIndexInput, NitrogenBalanceIndexOutput>;

export const nitrogenBalanceIndexTool = createSimpleTool({
  id: "biology/nitrogen-balance-index",
  title: "Nitrogen Balance Index",
  description:
    "Compute grain protein yield per kilogram of applied nitrogen, converting grain protein percentage to a decimal mass fraction before dividing by nitrogen input.",
  inputs: [
    {
      description: "Grain protein percentage; must not be negative.",
      id: "grainProteinPercent",
      kind: "number",
      label: "Grain protein",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      description: "Nitrogen applied in kilograms; must be greater than zero.",
      id: "nitrogenAppliedKg",
      kind: "number",
      label: "Nitrogen applied",
      unit: "kg",
    },
    {
      description: "Grain yield in kilograms.",
      id: "yieldKg",
      kind: "number",
      label: "Yield",
      minimum: 0,
      unit: "kg",
    },
  ],
  outputs: [
    {
      description:
        "Kilograms of grain protein per kilogram of applied nitrogen.",
      id: "nitrogenBalanceIndex",
      kind: "number",
      label: "Nitrogen balance index",
    },
  ],
  calculate: (input) => {
    const grainProteinPercent = input.grainProteinPercent as number;
    const nitrogenAppliedKg = input.nitrogenAppliedKg as number;
    const yieldKg = input.yieldKg as number;
    if (!(nitrogenAppliedKg > 0))
      simpleError(
        "nitrogenAppliedKg",
        "The nitrogen applied must be greater than zero.",
      );
    return {
      nitrogenBalanceIndex:
        ((grainProteinPercent / 100) * yieldKg) / nitrogenAppliedKg,
    };
  },
});
export const runNitrogenBalanceIndex = nitrogenBalanceIndexTool.execute;
export default nitrogenBalanceIndexTool;
