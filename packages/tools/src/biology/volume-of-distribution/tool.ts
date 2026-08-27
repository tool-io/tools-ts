import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const volumeOfDistributionExample = {
  input: { doseMg: 100, plasmaConcentrationMgL: 5 },
} satisfies ToolExample<{
  readonly doseMg: number;
  readonly plasmaConcentrationMgL: number;
}>;

export const volumeOfDistributionTool = createSimpleTool({
  id: "biology/volume-of-distribution",
  title: "Volume Of Distribution",
  description:
    "Compute the apparent volume of distribution from a dose and plasma concentration.",
  inputs: [
    { id: "doseMg", label: "Dose", kind: "number", unit: "mg" },
    {
      id: "plasmaConcentrationMgL",
      label: "Plasma concentration",
      kind: "number",
      unit: "mg/L",
    },
  ],
  outputs: [
    {
      id: "volumeOfDistributionL",
      label: "Volume of distribution",
      kind: "number",
      unit: "L",
    },
  ],
  calculate: (input) => {
    const doseMg = input.doseMg as number;
    const plasmaConcentrationMgL = input.plasmaConcentrationMgL as number;
    if (doseMg <= 0)
      simpleError("doseMg", "Dose must be greater than zero.", "invalid_dose");
    if (plasmaConcentrationMgL <= 0)
      simpleError(
        "plasmaConcentrationMgL",
        "Plasma concentration must be greater than zero.",
        "invalid_concentration",
      );
    return { volumeOfDistributionL: doseMg / plasmaConcentrationMgL };
  },
});
export const runVolumeOfDistribution = volumeOfDistributionTool.execute;
export default volumeOfDistributionTool;
