import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const alveolarVentilationExample = {
  input: {
    deadSpaceMl: 150,
    respiratoryRatePerMin: 12,
    tidalVolumeMl: 500,
  },
  output: { alveolarVentilationLPerMin: 4.2 },
} satisfies ToolExample<
  {
    readonly deadSpaceMl: number;
    readonly respiratoryRatePerMin: number;
    readonly tidalVolumeMl: number;
  },
  { readonly alveolarVentilationLPerMin: number }
>;

export const alveolarVentilationTool = createSimpleTool({
  id: "biology/alveolar-ventilation",
  title: "Alveolar Ventilation L/min",
  description:
    "Compute alveolar ventilation in litres per minute as (tidal volume - dead space) x respiratory rate / 1000.",
  inputs: [
    {
      id: "tidalVolumeMl",
      kind: "number",
      label: "Tidal volume",
      minimum: 0,
      unit: "mL",
    },
    {
      id: "deadSpaceMl",
      kind: "number",
      label: "Dead space volume",
      minimum: 0,
      unit: "mL",
    },
    {
      id: "respiratoryRatePerMin",
      kind: "number",
      label: "Respiratory rate",
      unit: "breaths/min",
    },
  ],
  outputs: [
    {
      id: "alveolarVentilationLPerMin",
      kind: "number",
      label: "Alveolar ventilation",
      unit: "L/min",
    },
  ],
  calculate: (input) => {
    const tidalVolumeMl = input.tidalVolumeMl as number;
    const deadSpaceMl = input.deadSpaceMl as number;
    const respiratoryRatePerMin = input.respiratoryRatePerMin as number;
    if (!(respiratoryRatePerMin > 0))
      simpleError(
        "respiratoryRatePerMin",
        "Respiratory rate must be positive.",
      );
    if (deadSpaceMl > tidalVolumeMl)
      simpleError(
        "deadSpaceMl",
        "Dead space must not exceed tidal volume.",
        "negative_ventilation",
      );
    return {
      alveolarVentilationLPerMin:
        ((tidalVolumeMl - deadSpaceMl) * respiratoryRatePerMin) / 1000,
    };
  },
});
export const runAlveolarVentilation = alveolarVentilationTool.execute;
export default alveolarVentilationTool;
