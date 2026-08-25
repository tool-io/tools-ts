import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const cellViabilityPercentageExample = {
  input: { total: 100, viable: 87 },
} satisfies ToolExample<{ readonly total: number; readonly viable: number }>;

export const cellViabilityPercentageTool = createSimpleTool({
  id: "biology/cell-viability-percentage",
  title: "Cell Viability %",
  description:
    "Calculate the viability percentage from viable and total cell counts.",
  inputs: [
    { id: "viable", label: "Viable cells", kind: "number" },
    { id: "total", label: "Total cells", kind: "number" },
  ],
  outputs: [
    { id: "viabilityPercent", label: "Viability", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const viable = input.viable as number;
    const total = input.total as number;
    if (total <= 0 || viable < 0 || viable > total)
      simpleError(
        "total",
        "Total must be positive and viable must not exceed it.",
        "invalid_counts",
      );
    return { viabilityPercent: (viable / total) * 100 };
  },
});
export const runCellViabilityPercentage = cellViabilityPercentageTool.execute;
export default cellViabilityPercentageTool;
