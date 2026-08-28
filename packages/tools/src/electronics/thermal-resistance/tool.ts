import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const thermalResistanceExample = {
  input: { ambientTempC: 25, junctionTempC: 85, powerWatts: 2 },
  output: { thermalResistanceCPerW: 30 },
} satisfies ToolExample<
  {
    readonly ambientTempC: number;
    readonly junctionTempC: number;
    readonly powerWatts: number;
  },
  { readonly thermalResistanceCPerW: number }
>;

export const thermalResistanceTool = createSimpleTool({
  calculate: (input) => {
    if (!((input.powerWatts as number) > 0))
      simpleError(
        "powerWatts",
        "Power dissipation must be positive.",
        "invalid_power",
      );
    return {
      thermalResistanceCPerW:
        ((input.junctionTempC as number) - (input.ambientTempC as number)) /
        (input.powerWatts as number),
    };
  },
  description:
    "Derive the junction-to-ambient thermal resistance from a steady-state temperature rise over dissipated power.",
  id: "electronics/thermal-resistance",
  inputs: [
    {
      id: "junctionTempC",
      kind: "number",
      label: "Junction temperature",
      unit: "°C",
    },
    {
      id: "ambientTempC",
      kind: "number",
      label: "Ambient temperature",
      unit: "°C",
    },
    { id: "powerWatts", kind: "number", label: "Power dissipation", unit: "W" },
  ],
  outputs: [
    {
      id: "thermalResistanceCPerW",
      kind: "number",
      label: "Thermal resistance",
      unit: "°C/W",
    },
  ],
  title: "Thermal Resistance °C/W",
});
export const runThermalResistance = thermalResistanceTool.execute;
export default thermalResistanceTool;
