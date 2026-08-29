import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: {
    temperatureRiseC: 10,
    barrelLengthM: 0.0016,
    innerRadiusM: 0.00015,
    platingThicknessM: 0.000025,
    copperResistivityOhmM: 1.72e-8,
    thermalResistanceCPerW: 100,
  },
  output: {
    electricalResistanceOhm: 0.001078140069880359,
    estimatedCurrentA: 9.630800938102935,
  },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "electronics/pcb-via-current-capacity",
  title: "PCB Via Current from Thermal Model",
  description:
    "Estimate via current from an allowed temperature rise and user-supplied effective thermal resistance using I=sqrt(ΔT/(R_electrical·R_thermal)). Barrel electrical resistance uses copper resistivity, length, and plated annulus area. This simplified lumped model requires board-specific thermal resistance.",
  inputs: [
    {
      id: "temperatureRiseC",
      kind: "number",
      label: "Allowed rise (°C)",
      minimum: 0,
    },
    {
      id: "barrelLengthM",
      kind: "number",
      label: "Via barrel length (m)",
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
      label: "Copper plating thickness (m)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "copperResistivityOhmM",
      kind: "number",
      label: "Copper resistivity (Ω·m)",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "thermalResistanceCPerW",
      kind: "number",
      label: "Effective thermal resistance (°C/W)",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "electricalResistanceOhm",
      kind: "number",
      label: "Electrical Resistance ohm",
    },
    { id: "estimatedCurrentA", kind: "number", label: "Estimated Current A" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      electricalResistanceOhm:
        (i.copperResistivityOhmM * i.barrelLengthM) /
        (Math.PI *
          (Math.pow(i.innerRadiusM + i.platingThicknessM, 2) -
            i.innerRadiusM * i.innerRadiusM)),
      estimatedCurrentA: Math.sqrt(
        i.temperatureRiseC /
          (((i.copperResistivityOhmM * i.barrelLengthM) /
            (Math.PI *
              (Math.pow(i.innerRadiusM + i.platingThicknessM, 2) -
                i.innerRadiusM * i.innerRadiusM))) *
            i.thermalResistanceCPerW),
      ),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type PcbViaCurrentCapacityInput = Readonly<typeof example.input>;
export type PcbViaCurrentCapacityOutput = Readonly<typeof example.output>;
export const pcbViaCurrentCapacityTool = tool;
export const runPcbViaCurrentCapacity = tool.execute;
export default tool;
