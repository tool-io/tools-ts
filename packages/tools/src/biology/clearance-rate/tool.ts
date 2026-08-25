import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const clearanceRateExample = {
  input: { aucMgHPerL: 125, doseMg: 500 },
} satisfies ToolExample<{
  readonly aucMgHPerL: number;
  readonly doseMg: number;
}>;

export const clearanceRateTool = createSimpleTool({
  id: "biology/clearance-rate",
  title: "Clearance Rate",
  description:
    "Compute drug clearance from an administered dose and the plasma AUC.",
  inputs: [
    { id: "doseMg", label: "Dose", kind: "number", unit: "mg" },
    {
      id: "aucMgHPerL",
      label: "Plasma AUC",
      kind: "number",
      unit: "mg·h/L",
    },
  ],
  outputs: [
    {
      id: "clearanceLPerHour",
      label: "Clearance",
      kind: "number",
      unit: "L/h",
    },
  ],
  calculate: (input) => {
    const doseMg = input.doseMg as number;
    const aucMgHPerL = input.aucMgHPerL as number;
    if (doseMg <= 0)
      simpleError("doseMg", "Dose must be greater than zero.", "invalid_dose");
    if (aucMgHPerL <= 0)
      simpleError(
        "aucMgHPerL",
        "AUC must be greater than zero.",
        "invalid_auc",
      );
    return { clearanceLPerHour: doseMg / aucMgHPerL };
  },
});
export const runClearanceRate = clearanceRateTool.execute;
export default clearanceRateTool;
