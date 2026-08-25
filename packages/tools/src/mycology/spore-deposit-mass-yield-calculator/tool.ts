import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const sporeDepositYieldCalculatorExample = {
  input: { collectionHoursInt: 8, depositMassMg: 120 },
  output: { sporeDepositMgPerHour: 15 },
} satisfies ToolExample<
  { readonly collectionHoursInt: number; readonly depositMassMg: number },
  { readonly sporeDepositMgPerHour: number }
>;

export const sporeDepositYieldCalculatorTool = createSimpleTool({
  id: "mycology/spore-deposit-mass-yield-calculator",
  title: "Spore Deposit Yield",
  description:
    "Compute the hourly spore deposit yield from a collected spore print mass over collection hours.",
  inputs: [
    {
      id: "depositMassMg",
      kind: "number",
      label: "Deposit mass",
      minimum: 0,
      unit: "mg",
    },
    {
      id: "collectionHoursInt",
      kind: "integer",
      label: "Collection hours",
      minimum: 1,
      unit: "hours",
    },
  ],
  outputs: [
    {
      id: "sporeDepositMgPerHour",
      kind: "number",
      label: "Deposit yield",
      minimum: 0,
      unit: "mg/hour",
    },
  ],
  calculate: (input) => ({
    sporeDepositMgPerHour:
      (input.depositMassMg as number) / (input.collectionHoursInt as number),
  }),
});
export const runSporeDepositYieldCalculator =
  sporeDepositYieldCalculatorTool.execute;
export default sporeDepositYieldCalculatorTool;
