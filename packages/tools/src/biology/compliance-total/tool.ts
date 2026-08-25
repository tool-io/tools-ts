import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const complianceTotalExample = {
  input: {
    exhaledTidalVolumeMl: 500,
    plateauPressureCmH2o: 25,
    totalPeepCmH2o: 5,
  },
  output: { totalComplianceMlPerCmh2o: 25 },
} satisfies ToolExample<
  {
    readonly exhaledTidalVolumeMl: number;
    readonly plateauPressureCmH2o: number;
    readonly totalPeepCmH2o: number;
  },
  { readonly totalComplianceMlPerCmh2o: number }
>;

export const complianceTotalTool = createSimpleTool({
  id: "biology/compliance-total",
  title: "Total Compliance",
  description:
    "Compute total respiratory system compliance as exhaled tidal volume divided by the driving pressure between plateau pressure and total PEEP.",
  inputs: [
    {
      id: "exhaledTidalVolumeMl",
      label: "Exhaled tidal volume",
      kind: "number",
      unit: "mL",
    },
    {
      id: "plateauPressureCmH2o",
      label: "Plateau pressure",
      kind: "number",
      unit: "cmH2O",
    },
    {
      id: "totalPeepCmH2o",
      label: "Total PEEP",
      kind: "number",
      unit: "cmH2O",
    },
  ],
  outputs: [
    {
      id: "totalComplianceMlPerCmh2o",
      label: "Total compliance",
      kind: "number",
      unit: "mL/cmH2O",
    },
  ],
  calculate: (input) => {
    const exhaledTidalVolumeMl = input.exhaledTidalVolumeMl as number;
    const plateauPressureCmH2o = input.plateauPressureCmH2o as number;
    const totalPeepCmH2o = input.totalPeepCmH2o as number;
    if (exhaledTidalVolumeMl <= 0)
      simpleError(
        "exhaledTidalVolumeMl",
        "Exhaled tidal volume must be greater than zero.",
      );
    if (plateauPressureCmH2o <= totalPeepCmH2o)
      simpleError(
        "plateauPressureCmH2o",
        "Plateau pressure must exceed total PEEP.",
        "negative_pressure",
      );
    return {
      totalComplianceMlPerCmh2o:
        exhaledTidalVolumeMl / (plateauPressureCmH2o - totalPeepCmH2o),
    };
  },
});
export const runComplianceTotal = complianceTotalTool.execute;
export default complianceTotalTool;
