import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const bioavailabilityPercentageExample = {
  input: { aucIv: 100, aucOral: 50, doseIv: 100, doseOral: 50 },
} satisfies ToolExample<{
  readonly aucIv: number;
  readonly aucOral: number;
  readonly doseIv: number;
  readonly doseOral: number;
}>;

export const bioavailabilityPercentageTool = createSimpleTool({
  id: "biology/bioavailability-percentage",
  title: "Bioavailability %",
  description:
    "Compute oral bioavailability as a percentage from AUC and dose comparisons.",
  inputs: [
    { id: "aucOral", label: "Oral AUC", kind: "number" },
    { id: "aucIv", label: "Intravenous AUC", kind: "number" },
    { id: "doseOral", label: "Oral dose", kind: "number" },
    { id: "doseIv", label: "Intravenous dose", kind: "number" },
  ],
  outputs: [
    {
      id: "bioavailabilityPercent",
      label: "Bioavailability",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const aucOral = input.aucOral as number;
    const aucIv = input.aucIv as number;
    const doseOral = input.doseOral as number;
    const doseIv = input.doseIv as number;
    if (aucOral < 0 || aucIv <= 0)
      simpleError(
        "aucOral",
        "Oral AUC cannot be negative and intravenous AUC must be positive.",
        "invalid_auc",
      );
    if (doseOral <= 0 || doseIv <= 0)
      simpleError(
        "doseOral",
        "Doses must be greater than zero.",
        "invalid_dose",
      );
    return {
      bioavailabilityPercent: (aucOral / aucIv) * 100 * (doseIv / doseOral),
    };
  },
});
export const runBioavailabilityPercentage =
  bioavailabilityPercentageTool.execute;
export default bioavailabilityPercentageTool;
