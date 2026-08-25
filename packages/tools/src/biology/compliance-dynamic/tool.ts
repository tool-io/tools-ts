import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const complianceDynamicExample = {
  input: { peakPressureCmh2o: 30, peepCmh2o: 5, tidalVolumeMl: 500 },
  output: { dynamicComplianceMlPerCmH2o: 20 },
} satisfies ToolExample<
  {
    readonly peakPressureCmh2o: number;
    readonly peepCmh2o: number;
    readonly tidalVolumeMl: number;
  },
  { readonly dynamicComplianceMlPerCmH2o: number }
>;

export const complianceDynamicTool = createSimpleTool({
  id: "biology/compliance-dynamic",
  title: "Dynamic Compliance",
  description:
    "Compute dynamic respiratory compliance as tidal volume divided by peak inspiratory pressure minus PEEP.",
  inputs: [
    {
      id: "tidalVolumeMl",
      label: "Tidal volume",
      kind: "number",
      unit: "mL",
    },
    {
      id: "peakPressureCmh2o",
      label: "Peak pressure",
      kind: "number",
      unit: "cmH2O",
    },
    { id: "peepCmh2o", label: "PEEP", kind: "number", unit: "cmH2O" },
  ],
  outputs: [
    {
      id: "dynamicComplianceMlPerCmH2o",
      label: "Dynamic compliance",
      kind: "number",
      unit: "mL/cmH2O",
    },
  ],
  calculate: (input) => {
    const tidalVolumeMl = input.tidalVolumeMl as number;
    const peakPressureCmh2o = input.peakPressureCmh2o as number;
    const peepCmh2o = input.peepCmh2o as number;
    if (tidalVolumeMl <= 0)
      simpleError("tidalVolumeMl", "Tidal volume must be greater than zero.");
    if (peakPressureCmh2o <= peepCmh2o)
      simpleError(
        "peakPressureCmh2o",
        "Peak pressure must exceed PEEP.",
        "negative_pressure",
      );
    return {
      dynamicComplianceMlPerCmH2o:
        tidalVolumeMl / (peakPressureCmh2o - peepCmh2o),
    };
  },
});
export const runComplianceDynamic = complianceDynamicTool.execute;
export default complianceDynamicTool;
