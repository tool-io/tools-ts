import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const hematocritPercentageExample = {
  input: { bloodSampleMl: 5, rbcVolumeMl: 2.25 },
  output: { hematocritPercent: 45 },
} satisfies ToolExample<
  { readonly bloodSampleMl: number; readonly rbcVolumeMl: number },
  { readonly hematocritPercent: number }
>;

export const hematocritPercentageTool = createSimpleTool({
  id: "biology/hematocrit-percentage",
  title: "Hematocrit %",
  description:
    "Compute hematocrit percent as the red cell volume divided by the total blood sample volume times 100.",
  inputs: [
    {
      id: "rbcVolumeMl",
      label: "Red cell volume",
      kind: "number",
      unit: "mL",
    },
    {
      id: "bloodSampleMl",
      label: "Blood sample volume",
      kind: "number",
      unit: "mL",
    },
  ],
  outputs: [
    {
      id: "hematocritPercent",
      label: "Hematocrit",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const rbcVolumeMl = input.rbcVolumeMl as number;
    const bloodSampleMl = input.bloodSampleMl as number;
    if (rbcVolumeMl < 0)
      simpleError("rbcVolumeMl", "Red cell volume must not be negative.");
    if (bloodSampleMl <= 0)
      simpleError("bloodSampleMl", "Blood sample volume must be positive.");
    if (rbcVolumeMl > bloodSampleMl)
      simpleError(
        "rbcVolumeMl",
        "Red cell volume must not exceed the blood sample volume.",
      );
    return { hematocritPercent: (rbcVolumeMl / bloodSampleMl) * 100 };
  },
});
export const runHematocritPercentage = hematocritPercentageTool.execute;
export default hematocritPercentageTool;
