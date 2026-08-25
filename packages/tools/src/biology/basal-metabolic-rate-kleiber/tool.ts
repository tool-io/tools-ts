import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const basalMetabolicRateKleiberExample = {
  input: { bodyMassKg: 70 },
  output: { basalMetabolicRateKcal: 1694.031844745511 },
} satisfies ToolExample<
  { readonly bodyMassKg: number },
  { readonly basalMetabolicRateKcal: number }
>;

export const basalMetabolicRateKleiberTool = createSimpleTool({
  id: "biology/basal-metabolic-rate-kleiber",
  title: "Kleiber BMR",
  description:
    "Estimate basal metabolic rate across animals with Kleiber's law: BMR = 70 x bodyMass^0.75 kilocalories per day.",
  inputs: [
    {
      description: "Body mass in kilograms; must be greater than zero.",
      id: "bodyMassKg",
      label: "Body mass",
      kind: "number",
      unit: "kg",
    },
  ],
  outputs: [
    {
      description: "Basal metabolic rate in kilocalories per day.",
      id: "basalMetabolicRateKcal",
      label: "Basal metabolic rate",
      kind: "number",
      unit: "kcal/day",
    },
  ],
  calculate: (input) => {
    const bodyMassKg = input.bodyMassKg as number;
    if (!(bodyMassKg > 0))
      simpleError("bodyMassKg", "The body mass must be greater than zero.");
    return { basalMetabolicRateKcal: 70 * Math.pow(bodyMassKg, 0.75) };
  },
});
export const runBasalMetabolicRateKleiber =
  basalMetabolicRateKleiberTool.execute;
export default basalMetabolicRateKleiberTool;
