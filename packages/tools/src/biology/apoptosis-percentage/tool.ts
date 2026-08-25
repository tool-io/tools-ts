import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const apoptosisPercentageExample = {
  input: { apoptoticCells: 75, totalCells: 500 },
} satisfies ToolExample<{
  readonly apoptoticCells: number;
  readonly totalCells: number;
}>;

export const apoptosisPercentageTool = createSimpleTool({
  id: "biology/apoptosis-percentage",
  title: "Apoptosis %",
  description:
    "Calculate the apoptosis percentage from apoptotic and total cell counts.",
  inputs: [
    { id: "apoptoticCells", label: "Apoptotic cells", kind: "number" },
    { id: "totalCells", label: "Total cells", kind: "number" },
  ],
  outputs: [
    { id: "apoptosisPercent", label: "Apoptosis", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const apoptoticCells = input.apoptoticCells as number;
    const totalCells = input.totalCells as number;
    if (totalCells <= 0 || apoptoticCells < 0 || apoptoticCells > totalCells)
      simpleError(
        "totalCells",
        "Total must be positive and apoptotic count must not exceed it.",
        "invalid_counts",
      );
    return { apoptosisPercent: (apoptoticCells / totalCells) * 100 };
  },
});
export const runApoptosisPercentage = apoptosisPercentageTool.execute;
export default apoptosisPercentageTool;
