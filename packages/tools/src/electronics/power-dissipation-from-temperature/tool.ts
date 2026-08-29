import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    junctionTemperatureC: 85,
    ambientTemperatureC: 25,
    thermalResistanceCPerW: 30,
  },
  output: { powerW: 2 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/power-dissipation-from-temperature",
  title: "Power Dissipation from Temperature Rise",
  description:
    "Infer steady-state power dissipation as (Tj−Ta)/θJA from a measured junction and ambient temperature. Use the effective thermal resistance for the same assembly and cooling conditions.",
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
      id: "thermalResistanceCPerW",
      kind: "number",
      label: "Junction-to-ambient resistance (°C/W)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [{ id: "powerW", kind: "number", label: "Power W" }],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      powerW:
        (i.junctionTemperatureC - i.ambientTemperatureC) /
        i.thermalResistanceCPerW,
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type PowerDissipationFromTemperatureInput = Readonly<
  typeof example.input
>;
export type PowerDissipationFromTemperatureOutput = Readonly<
  typeof example.output
>;
export const powerDissipationFromTemperatureTool = tool;
export const runPowerDissipationFromTemperature = tool.execute;
export default tool;
