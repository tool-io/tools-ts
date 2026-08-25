import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const airwayResistanceTotalExample = {
  input: {
    inspiratoryFlowLs: 1,
    peakInspiratoryPressureCmH2o: 30,
    pausePlateauCmH2o: 10,
  },
  output: { totalAirwayResistance: 20 },
} satisfies ToolExample<
  {
    readonly inspiratoryFlowLs: number;
    readonly peakInspiratoryPressureCmH2o: number;
    readonly pausePlateauCmH2o: number;
  },
  { readonly totalAirwayResistance: number }
>;

export const airwayResistanceTotalTool = createSimpleTool({
  id: "biology/airway-resistance-total",
  title: "Total Airway Resistance",
  description:
    "Compute total airway resistance as the difference between peak inspiratory pressure and pause plateau pressure divided by inspiratory flow.",
  inputs: [
    {
      id: "peakInspiratoryPressureCmH2o",
      label: "Peak inspiratory pressure",
      kind: "number",
      unit: "cmH2O",
    },
    {
      id: "pausePlateauCmH2o",
      label: "Pause plateau pressure",
      kind: "number",
      unit: "cmH2O",
    },
    {
      id: "inspiratoryFlowLs",
      label: "Inspiratory flow",
      kind: "number",
      unit: "L/s",
    },
  ],
  outputs: [
    {
      id: "totalAirwayResistance",
      label: "Total airway resistance",
      kind: "number",
      unit: "cmH2O/L/s",
    },
  ],
  calculate: (input) => {
    const peakInspiratoryPressureCmH2o =
      input.peakInspiratoryPressureCmH2o as number;
    const pausePlateauCmH2o = input.pausePlateauCmH2o as number;
    const inspiratoryFlowLs = input.inspiratoryFlowLs as number;
    if (inspiratoryFlowLs <= 0)
      simpleError(
        "inspiratoryFlowLs",
        "Inspiratory flow must be greater than zero.",
      );
    if (peakInspiratoryPressureCmH2o < pausePlateauCmH2o)
      simpleError(
        "peakInspiratoryPressureCmH2o",
        "Peak inspiratory pressure must not be below the pause plateau pressure.",
        "negative_difference",
      );
    return {
      totalAirwayResistance:
        (peakInspiratoryPressureCmH2o - pausePlateauCmH2o) / inspiratoryFlowLs,
    };
  },
});
export const runAirwayResistanceTotal = airwayResistanceTotalTool.execute;
export default airwayResistanceTotalTool;
