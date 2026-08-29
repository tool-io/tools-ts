import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { junctionTemperatureC: 85, ambientTemperatureC: 25, powerW: 2 },
  output: { thermalResistanceCPerW: 30 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/junction-to-ambient-thermal-resistance",
  title: "Junction-to-Ambient Thermal Resistance",
  description:
    "Infer effective junction-to-ambient thermal resistance as (Tj−Ta)/P for a steady operating point. The value depends on board and airflow conditions and is not necessarily the datasheet test value.",
  inputs: [
    {
      id: "junctionTemperatureC",
      kind: "number",
      label: "Junction temperature (°C)",
    },
    {
      id: "ambientTemperatureC",
      kind: "number",
      label: "Ambient temperature (°C)",
    },
    {
      id: "powerW",
      kind: "number",
      label: "Dissipation (W)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "thermalResistanceCPerW",
      kind: "number",
      label: "Thermal Resistance CPer W",
    },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      thermalResistanceCPerW:
        (i.junctionTemperatureC - i.ambientTemperatureC) / i.powerW,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type JunctionToAmbientThermalResistanceInput = Readonly<
  typeof example.input
>;
export type JunctionToAmbientThermalResistanceOutput = Readonly<
  typeof example.output
>;
export const junctionToAmbientThermalResistanceTool = tool;
export const runJunctionToAmbientThermalResistance = tool.execute;
export default tool;
