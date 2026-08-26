import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const inrRatioExample = {
  input: { meanNormalPtSeconds: 12, patientPtSeconds: 24 },
  output: { inr: 2 },
} satisfies ToolExample<
  {
    readonly isi?: number;
    readonly meanNormalPtSeconds: number;
    readonly patientPtSeconds: number;
  },
  { readonly inr: number }
>;

export const inrRatioTool = createSimpleTool({
  id: "biology/inr-ratio",
  title: "INR Ratio",
  description:
    "Compute the international normalized ratio as (patient PT / mean normal PT)^ISI. Use the International Sensitivity Index assigned to the specific thromboplastin reagent and instrument; the default of one is only appropriate when that is the calibrated ISI.",
  inputs: [
    {
      id: "patientPtSeconds",
      label: "Patient PT",
      kind: "number",
      unit: "s",
    },
    {
      id: "meanNormalPtSeconds",
      label: "Mean normal PT",
      kind: "number",
      unit: "s",
    },
    {
      default: 1,
      description:
        "International Sensitivity Index for the reagent/instrument.",
      id: "isi",
      label: "ISI",
      kind: "number",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "inr", label: "INR", kind: "number" }],
  calculate: (input) => {
    const patientPtSeconds = input.patientPtSeconds as number;
    const meanNormalPtSeconds = input.meanNormalPtSeconds as number;
    if (patientPtSeconds <= 0)
      simpleError("patientPtSeconds", "Patient PT must be greater than zero.");
    if (meanNormalPtSeconds <= 0)
      simpleError(
        "meanNormalPtSeconds",
        "Mean normal PT must be greater than zero.",
      );
    return {
      inr: Math.pow(
        patientPtSeconds / meanNormalPtSeconds,
        input.isi as number,
      ),
    };
  },
});
export const runInrRatio = inrRatioTool.execute;
export default inrRatioTool;
