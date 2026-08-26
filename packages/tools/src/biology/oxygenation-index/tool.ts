import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const oxygenationIndexExample = {
  input: { fiO2Fraction: 0.5, meanAirwayPressureCmH2o: 12, pao2Mmhg: 80 },
  output: { oxygenationIndex: 7.5 },
} satisfies ToolExample<
  {
    readonly fiO2Fraction: number;
    readonly meanAirwayPressureCmH2o: number;
    readonly pao2Mmhg: number;
  },
  { readonly oxygenationIndex: number }
>;

export const oxygenationIndexTool = createSimpleTool({
  id: "biology/oxygenation-index",
  title: "Oxygenation Index OI",
  description:
    "Compute the oxygenation index as mean airway pressure x FiO2 x 100 divided by arterial oxygen tension.",
  inputs: [
    {
      id: "meanAirwayPressureCmH2o",
      label: "Mean airway pressure",
      kind: "number",
      unit: "cmH2O",
    },
    {
      id: "fiO2Fraction",
      label: "Inspired oxygen fraction",
      kind: "number",
      maximum: 1,
      minimum: 0,
    },
    { id: "pao2Mmhg", label: "Arterial O2", kind: "number", unit: "mmHg" },
  ],
  outputs: [
    {
      id: "oxygenationIndex",
      label: "Oxygenation index",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const meanAirwayPressureCmH2o = input.meanAirwayPressureCmH2o as number;
    const pao2Mmhg = input.pao2Mmhg as number;
    const fiO2Fraction = input.fiO2Fraction as number;
    if (meanAirwayPressureCmH2o <= 0)
      simpleError(
        "meanAirwayPressureCmH2o",
        "Mean airway pressure must be greater than zero.",
      );
    if (pao2Mmhg <= 0)
      simpleError("pao2Mmhg", "Arterial O2 must be greater than zero.");
    if (fiO2Fraction <= 0 || fiO2Fraction >= 1)
      simpleError(
        "fiO2Fraction",
        "Inspired oxygen fraction must be strictly between 0 and 1.",
      );
    return {
      oxygenationIndex:
        (meanAirwayPressureCmH2o * fiO2Fraction * 100) / pao2Mmhg,
    };
  },
});
export const runOxygenationIndex = oxygenationIndexTool.execute;
export default oxygenationIndexTool;
