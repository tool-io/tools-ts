import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    boardThicknessM: 0.0016,
    innerRadiusM: 0.00015,
    platingThicknessM: 0.000025,
    thermalConductivityWPerMK: 400,
  },
  output: { thermalResistanceKPerW: 156.70640550586617 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/thermal-via-resistance",
  title: "Thermal Via Barrel Resistance",
  description:
    "Estimate one-dimensional thermal resistance through the plated via barrel, L/(kA), where A is the annular copper cross-section. Board laminate, pads, and spreading resistance are excluded.",
  inputs: [
    {
      id: "boardThicknessM",
      kind: "number",
      label: "Via length (m)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "innerRadiusM",
      kind: "number",
      label: "Inner barrel radius (m)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "platingThicknessM",
      kind: "number",
      label: "Plating thickness (m)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "thermalConductivityWPerMK",
      kind: "number",
      label: "Copper thermal conductivity (W/m·K)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "thermalResistanceKPerW",
      kind: "number",
      label: "Thermal Resistance KPer W",
    },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      thermalResistanceKPerW:
        i.boardThicknessM /
        (i.thermalConductivityWPerMK *
          Math.PI *
          (Math.pow(i.innerRadiusM + i.platingThicknessM, 2) -
            i.innerRadiusM * i.innerRadiusM)),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type ThermalViaResistanceInput = Readonly<typeof example.input>;
export type ThermalViaResistanceOutput = Readonly<typeof example.output>;
export const thermalViaResistanceTool = tool;
export const runThermalViaResistance = tool.execute;
export default tool;
