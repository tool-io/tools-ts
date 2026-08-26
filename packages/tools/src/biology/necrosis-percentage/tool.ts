import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const necrosisPercentageExample = {
  input: { necroticCells: 50, totalCells: 400 },
} satisfies ToolExample<{
  readonly necroticCells: number;
  readonly totalCells: number;
}>;

export const necrosisPercentageTool = createSimpleTool({
  id: "biology/necrosis-percentage",
  title: "Necrosis %",
  description:
    "Calculate the necrosis percentage from necrotic and total cell counts.",
  inputs: [
    { id: "necroticCells", label: "Necrotic cells", kind: "number" },
    { id: "totalCells", label: "Total cells", kind: "number" },
  ],
  outputs: [
    { id: "necrosisPercent", label: "Necrosis", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const necroticCells = input.necroticCells as number;
    const totalCells = input.totalCells as number;
    if (totalCells <= 0 || necroticCells < 0 || necroticCells > totalCells)
      simpleError(
        "totalCells",
        "Total must be positive and necrotic count must not exceed it.",
        "invalid_counts",
      );
    return { necrosisPercent: (necroticCells / totalCells) * 100 };
  },
});
export const runNecrosisPercentage = necrosisPercentageTool.execute;
export default necrosisPercentageTool;
