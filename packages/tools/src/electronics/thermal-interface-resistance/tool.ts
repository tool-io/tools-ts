import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThermalInterfaceResistanceInput = Readonly<{
  readonly interfaceThicknessMeters: number;
  readonly thermalConductivityWattsPerMeterKelvin: number;
  readonly contactAreaSquareMeters: number;
}>;
export type ThermalInterfaceResistanceOutput = Readonly<{
  thermalResistanceKelvinPerWatt: number;
}>;

export const calculateThermalInterfaceResistance = (
  i: ThermalInterfaceResistanceInput,
): ThermalInterfaceResistanceOutput => {
  const value =
    i.interfaceThicknessMeters /
    (i.thermalConductivityWattsPerMeterKelvin * i.contactAreaSquareMeters);
  if (!Number.isFinite(value))
    simpleError(
      "thermalResistanceKelvinPerWatt",
      "The inputs produce a non-finite result.",
    );
  return { thermalResistanceKelvinPerWatt: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: {
    interfaceThicknessMeters: 0.0005,
    thermalConductivityWattsPerMeterKelvin: 3,
    contactAreaSquareMeters: 0.001,
  },
  output: { thermalResistanceKelvinPerWatt: 0.16666666666666666 },
} satisfies ToolExample<
  ThermalInterfaceResistanceInput,
  ThermalInterfaceResistanceOutput
>;

export const tool = createSimpleTool({
  id: "electronics/thermal-interface-resistance",
  title: "Thermal Interface Resistance",
  description:
    "Calculate ideal thermal interface resistance t/(kA) from uniform pad thickness, thermal conductivity, and contact area; contact imperfections are excluded.",
  inputs: [
    {
      id: "interfaceThicknessMeters",
      kind: "number",
      label: "Interface Thickness (m)",
      unit: "m",
      minimum: 0,
    },
    {
      id: "thermalConductivityWattsPerMeterKelvin",
      kind: "number",
      label: "Thermal Conductivity Watts Per Meter (K)",
      unit: "K",
      minimum: Number.MIN_VALUE,
    },
    {
      id: "contactAreaSquareMeters",
      kind: "number",
      label: "Contact Area (m²)",
      unit: "m²",
      minimum: Number.MIN_VALUE,
    },
  ],
  outputs: [
    {
      id: "thermalResistanceKelvinPerWatt",
      kind: "number",
      label: "Thermal Resistance (K/W)",
      unit: "K/W",
    },
  ],
  calculate: (input) =>
    calculateThermalInterfaceResistance({
      interfaceThicknessMeters: input.interfaceThicknessMeters as number,
      thermalConductivityWattsPerMeterKelvin:
        input.thermalConductivityWattsPerMeterKelvin as number,
      contactAreaSquareMeters: input.contactAreaSquareMeters as number,
    }),
});
export const thermalInterfaceResistanceTool = tool;
export const runThermalInterfaceResistance = tool.execute;
export default tool;
