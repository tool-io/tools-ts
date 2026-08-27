import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const transfectionEfficiencyExample = {
  input: { fluorescentCells: 250, totalCells: 500 },
} satisfies ToolExample<{
  readonly fluorescentCells: number;
  readonly totalCells: number;
}>;

export const transfectionEfficiencyTool = createSimpleTool({
  id: "biology/transfection-efficiency",
  title: "Transfection Efficiency %",
  description:
    "Compute transfection efficiency as the percentage of fluorescent cells.",
  inputs: [
    {
      id: "fluorescentCells",
      label: "Fluorescent cells",
      kind: "integer",
      minimum: 0,
    },
    { id: "totalCells", label: "Total cells", kind: "integer", minimum: 1 },
  ],
  outputs: [
    {
      id: "efficiencyPercent",
      label: "Efficiency",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const fluorescentCells = input.fluorescentCells as number;
    const totalCells = input.totalCells as number;
    if (fluorescentCells > totalCells)
      simpleError(
        "fluorescentCells",
        "Fluorescent cells must not exceed total cells.",
        "exceeds_total",
      );
    return { efficiencyPercent: (fluorescentCells / totalCells) * 100 };
  },
});
export const runTransfectionEfficiency = transfectionEfficiencyTool.execute;
export default transfectionEfficiencyTool;
