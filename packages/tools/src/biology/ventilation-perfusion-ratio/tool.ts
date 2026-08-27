import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const ventilationPerfusionRatioExample = {
  input: { alveolarVentilationLPerMin: 4, pulmonaryBloodFlowLPerMin: 5 },
  output: { ventilationPerfusionRatio: 0.8 },
} satisfies ToolExample<
  {
    readonly alveolarVentilationLPerMin: number;
    readonly pulmonaryBloodFlowLPerMin: number;
  },
  { readonly ventilationPerfusionRatio: number }
>;

export const ventilationPerfusionRatioTool = createSimpleTool({
  id: "biology/ventilation-perfusion-ratio",
  title: "V/Q Ratio",
  description:
    "Compute the ventilation-perfusion ratio as alveolar ventilation divided by pulmonary blood flow.",
  inputs: [
    {
      id: "alveolarVentilationLPerMin",
      label: "Alveolar ventilation",
      kind: "number",
      minimum: 0,
      unit: "L/min",
    },
    {
      id: "pulmonaryBloodFlowLPerMin",
      label: "Pulmonary blood flow",
      kind: "number",
      unit: "L/min",
    },
  ],
  outputs: [
    {
      id: "ventilationPerfusionRatio",
      label: "V/Q ratio",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const pulmonaryBloodFlowLPerMin = input.pulmonaryBloodFlowLPerMin as number;
    if (pulmonaryBloodFlowLPerMin <= 0)
      simpleError(
        "pulmonaryBloodFlowLPerMin",
        "Pulmonary blood flow must be greater than zero.",
      );
    return {
      ventilationPerfusionRatio:
        (input.alveolarVentilationLPerMin as number) /
        pulmonaryBloodFlowLPerMin,
    };
  },
});
export const runVentilationPerfusionRatio =
  ventilationPerfusionRatioTool.execute;
export default ventilationPerfusionRatioTool;
