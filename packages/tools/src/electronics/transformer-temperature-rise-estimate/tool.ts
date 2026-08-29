import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { totalLossW: 10, thermalResistanceCPerW: 5 },
  output: { temperatureRiseC: 50 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/transformer-temperature-rise-estimate",
  title: "Transformer Temperature Rise Estimate",
  description:
    "Estimate steady transformer temperature rise as total heat dissipation multiplied by measured effective thermal resistance to ambient. Airflow, enclosure, mounting, and temperature-dependent losses can change the actual rise.",
  inputs: [
    {
      id: "totalLossW",
      kind: "number",
      label: "Total transformer loss (W)",
      minimum: 0,
    },
    {
      id: "thermalResistanceCPerW",
      kind: "number",
      label: "Effective thermal resistance (°C/W)",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "temperatureRiseC", kind: "number", label: "Temperature Rise C" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      temperatureRiseC: i.totalLossW * i.thermalResistanceCPerW,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type TransformerTemperatureRiseEstimateInput = Readonly<
  typeof example.input
>;
export type TransformerTemperatureRiseEstimateOutput = Readonly<
  typeof example.output
>;
export const transformerTemperatureRiseEstimateTool = tool;
export const runTransformerTemperatureRiseEstimate = tool.execute;
export default tool;
