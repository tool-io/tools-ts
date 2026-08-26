import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const hemocytometerViabilityExample = {
  input: { stainedCells: 50, unstainedCells: 150 },
} satisfies ToolExample<{
  readonly stainedCells: number;
  readonly unstainedCells: number;
}>;

export const hemocytometerViabilityTool = createSimpleTool({
  id: "biology/hemocytometer-viability",
  title: "Trypan Blue Viability %",
  description:
    "Compute cell viability from trypan blue stained and unstained counts.",
  inputs: [
    {
      id: "unstainedCells",
      label: "Unstained cells",
      kind: "integer",
      minimum: 0,
    },
    { id: "stainedCells", label: "Stained cells", kind: "integer", minimum: 0 },
  ],
  outputs: [
    { id: "viabilityPercent", label: "Viability", kind: "number", unit: "%" },
  ],
  calculate: (input) => {
    const unstainedCells = input.unstainedCells as number;
    const stainedCells = input.stainedCells as number;
    const total = unstainedCells + stainedCells;
    if (total <= 0)
      simpleError(
        "unstainedCells",
        "Total cell count must be greater than zero.",
        "insufficient_cells",
      );
    return { viabilityPercent: (unstainedCells / total) * 100 };
  },
});
export const runHemocytometerViability = hemocytometerViabilityTool.execute;
export default hemocytometerViabilityTool;
