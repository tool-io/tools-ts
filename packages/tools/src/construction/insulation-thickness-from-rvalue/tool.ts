import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type InsulationThicknessFromRvalueInput = Readonly<{
  readonly targetSquareMeterKelvinPerWatt: number;
  readonly conductivityWattsPerMeterKelvin: number;
}>;
export type InsulationThicknessFromRvalueOutput = Readonly<{
  readonly thicknessMeters: number;
}>;

export const calculateInsulationThicknessFromRvalue = (
  x: InsulationThicknessFromRvalueInput,
): InsulationThicknessFromRvalueOutput => {
  if (
    !Number.isFinite(x.targetSquareMeterKelvinPerWatt) ||
    x.targetSquareMeterKelvinPerWatt < 0
  )
    simpleError(
      "targetSquareMeterKelvinPerWatt",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.conductivityWattsPerMeterKelvin) ||
    x.conductivityWattsPerMeterKelvin < 0
  )
    simpleError(
      "conductivityWattsPerMeterKelvin",
      "Provide a finite number at least 0.",
    );
  const thicknessMeters =
    x.targetSquareMeterKelvinPerWatt * x.conductivityWattsPerMeterKelvin;
  if (!Number.isFinite(thicknessMeters))
    simpleError(
      "thicknessMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    thicknessMeters: Object.is(thicknessMeters, -0) ? 0 : thicknessMeters,
  };
};

export const example = {
  input: {
    targetSquareMeterKelvinPerWatt: 5,
    conductivityWattsPerMeterKelvin: 0.04,
  },
  output: { thicknessMeters: 0.2 },
} satisfies ToolExample<
  InsulationThicknessFromRvalueInput,
  InsulationThicknessFromRvalueOutput
>;

export const tool = createSimpleTool({
  id: "construction/insulation-thickness-from-rvalue",
  title: "Insulation Thickness From Rvalue",
  description:
    "Homogeneous insulation thickness from target area-specific R-value and material thermal conductivity in SI units.",
  inputs: [
    {
      id: "targetSquareMeterKelvinPerWatt",
      kind: "number",
      label: "Target Square Meter Kelvin Per Watt",
      unit: "m²K/W",
      minimum: 0,
    },
    {
      id: "conductivityWattsPerMeterKelvin",
      kind: "number",
      label: "Conductivity Watts Per Meter Kelvin",
      unit: "W/(m·K)",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "thicknessMeters",
      kind: "number",
      label: "Thickness Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateInsulationThicknessFromRvalue({
      targetSquareMeterKelvinPerWatt:
        input.targetSquareMeterKelvinPerWatt as number,
      conductivityWattsPerMeterKelvin:
        input.conductivityWattsPerMeterKelvin as number,
    }),
});
export const insulationThicknessFromRvalueTool = tool;
export const runInsulationThicknessFromRvalue = tool.execute;
export default tool;
