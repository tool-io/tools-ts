import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const airwayResistanceExample = {
  input: {
    flowLPerSecond: 0.5,
    peakPressureCmh2o: 30,
    plateauPressureCmh2o: 20,
  },
  output: { airwayResistanceCmh2oLPerS: 20 },
} satisfies ToolExample<
  {
    readonly flowLPerSecond: number;
    readonly peakPressureCmh2o: number;
    readonly plateauPressureCmh2o: number;
  },
  { readonly airwayResistanceCmh2oLPerS: number }
>;

export const airwayResistanceTool = createSimpleTool({
  id: "biology/airway-resistance",
  title: "Airway Resistance",
  description:
    "Compute airway resistance as peak pressure minus plateau pressure divided by inspiratory flow.",
  inputs: [
    {
      id: "peakPressureCmh2o",
      label: "Peak pressure",
      kind: "number",
      unit: "cmH2O",
    },
    {
      id: "plateauPressureCmh2o",
      label: "Plateau pressure",
      kind: "number",
      unit: "cmH2O",
    },
    {
      id: "flowLPerSecond",
      label: "Inspiratory flow",
      kind: "number",
      unit: "L/s",
    },
  ],
  outputs: [
    {
      id: "airwayResistanceCmh2oLPerS",
      label: "Airway resistance",
      kind: "number",
      unit: "cmH2O/L/s",
    },
  ],
  calculate: (input) => {
    const peakPressureCmh2o = input.peakPressureCmh2o as number;
    const plateauPressureCmh2o = input.plateauPressureCmh2o as number;
    const flowLPerSecond = input.flowLPerSecond as number;
    if (flowLPerSecond <= 0)
      simpleError("flowLPerSecond", "Flow must be greater than zero.");
    if (peakPressureCmh2o < plateauPressureCmh2o)
      simpleError(
        "peakPressureCmh2o",
        "Peak pressure must not fall below plateau pressure.",
        "negative_difference",
      );
    return {
      airwayResistanceCmh2oLPerS:
        (peakPressureCmh2o - plateauPressureCmh2o) / flowLPerSecond,
    };
  },
});
export const runAirwayResistance = airwayResistanceTool.execute;
export default airwayResistanceTool;
