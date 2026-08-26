import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const oxygenationIndexVariantExample = {
  input: { fiO2PercentNumber: 40, meanAirwayPressureCmH2o: 12, paO2Mmhg: 80 },
  output: { oxygenationIndexVariant: 6 },
} satisfies ToolExample<
  {
    readonly fiO2PercentNumber: number;
    readonly meanAirwayPressureCmH2o: number;
    readonly paO2Mmhg: number;
  },
  { readonly oxygenationIndexVariant: number }
>;

export const oxygenationIndexVariantTool = createSimpleTool({
  id: "biology/oxygenation-index-2",
  title: "OI Variant With PEEP",
  description:
    "Compute an oxygenation index variant as mean airway pressure times the inspired oxygen percentage divided by arterial oxygen tension, without a scaling factor of 100.",
  inputs: [
    {
      id: "meanAirwayPressureCmH2o",
      label: "Mean airway pressure",
      kind: "number",
      unit: "cmH2O",
    },
    {
      id: "fiO2PercentNumber",
      label: "Inspired oxygen percent",
      description:
        "Entered as a plain percentage number such as 40 instead of a fraction.",
      kind: "number",
      maximum: 100,
      minimum: 1,
    },
    { id: "paO2Mmhg", label: "Arterial O2", kind: "number", unit: "mmHg" },
  ],
  outputs: [
    {
      id: "oxygenationIndexVariant",
      label: "Oxygenation index variant",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const meanAirwayPressureCmH2o = input.meanAirwayPressureCmH2o as number;
    const fiO2PercentNumber = input.fiO2PercentNumber as number;
    const paO2Mmhg = input.paO2Mmhg as number;
    if (meanAirwayPressureCmH2o <= 0)
      simpleError(
        "meanAirwayPressureCmH2o",
        "Mean airway pressure must be greater than zero.",
      );
    if (paO2Mmhg <= 0)
      simpleError("paO2Mmhg", "Arterial O2 must be greater than zero.");
    return {
      oxygenationIndexVariant:
        (meanAirwayPressureCmH2o * fiO2PercentNumber) / paO2Mmhg,
    };
  },
});
export const runOxygenationIndexVariant = oxygenationIndexVariantTool.execute;
export default oxygenationIndexVariantTool;
