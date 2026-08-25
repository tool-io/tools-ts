import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const complianceStaticExample = {
  input: { peepCmh2o: 5, plateauPressureCmh2o: 25, tidalVolumeMl: 500 },
  output: { staticComplianceMlPerCmH2o: 25 },
} satisfies ToolExample<
  {
    readonly peepCmh2o: number;
    readonly plateauPressureCmh2o: number;
    readonly tidalVolumeMl: number;
  },
  { readonly staticComplianceMlPerCmH2o: number }
>;

export const complianceStaticTool = createSimpleTool({
  id: "biology/compliance-static",
  title: "Static Compliance",
  description:
    "Compute static respiratory compliance as tidal volume divided by plateau pressure minus PEEP.",
  inputs: [
    {
      id: "tidalVolumeMl",
      label: "Tidal volume",
      kind: "number",
      unit: "mL",
    },
    {
      id: "plateauPressureCmh2o",
      label: "Plateau pressure",
      kind: "number",
      unit: "cmH2O",
    },
    { id: "peepCmh2o", label: "PEEP", kind: "number", unit: "cmH2O" },
  ],
  outputs: [
    {
      id: "staticComplianceMlPerCmH2o",
      label: "Static compliance",
      kind: "number",
      unit: "mL/cmH2O",
    },
  ],
  calculate: (input) => {
    const tidalVolumeMl = input.tidalVolumeMl as number;
    const plateauPressureCmh2o = input.plateauPressureCmh2o as number;
    const peepCmh2o = input.peepCmh2o as number;
    if (tidalVolumeMl <= 0)
      simpleError("tidalVolumeMl", "Tidal volume must be greater than zero.");
    if (plateauPressureCmh2o <= peepCmh2o)
      simpleError(
        "plateauPressureCmh2o",
        "Plateau pressure must exceed PEEP.",
        "negative_pressure",
      );
    return {
      staticComplianceMlPerCmH2o:
        tidalVolumeMl / (plateauPressureCmh2o - peepCmh2o),
    };
  },
});
export const runComplianceStatic = complianceStaticTool.execute;
export default complianceStaticTool;
