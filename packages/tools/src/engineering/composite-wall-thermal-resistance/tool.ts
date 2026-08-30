import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CompositeWallThermalResistanceInput = Readonly<{
  readonly firstThicknessMeters: number;
  readonly firstConductivityWattsPerMeterKelvin: number;
  readonly secondThicknessMeters: number;
  readonly secondConductivityWattsPerMeterKelvin: number;
}>;
export type CompositeWallThermalResistanceOutput = Readonly<{
  readonly areaResistanceSquareMeterKelvinPerWatt: number;
}>;

export const calculateCompositeWallThermalResistance = (
  x: CompositeWallThermalResistanceInput,
): CompositeWallThermalResistanceOutput => {
  if (!Number.isFinite(x.firstThicknessMeters) || x.firstThicknessMeters < 0)
    simpleError("firstThicknessMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.firstConductivityWattsPerMeterKelvin) ||
    x.firstConductivityWattsPerMeterKelvin < 0
  )
    simpleError(
      "firstConductivityWattsPerMeterKelvin",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.secondThicknessMeters) || x.secondThicknessMeters < 0)
    simpleError("secondThicknessMeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.secondConductivityWattsPerMeterKelvin) ||
    x.secondConductivityWattsPerMeterKelvin < 0
  )
    simpleError(
      "secondConductivityWattsPerMeterKelvin",
      "Provide a finite number at least 0.",
    );
  const areaResistanceSquareMeterKelvinPerWatt =
    x.firstThicknessMeters / x.firstConductivityWattsPerMeterKelvin +
    x.secondThicknessMeters / x.secondConductivityWattsPerMeterKelvin;
  if (!Number.isFinite(areaResistanceSquareMeterKelvinPerWatt))
    simpleError(
      "areaResistanceSquareMeterKelvinPerWatt",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    areaResistanceSquareMeterKelvinPerWatt: Object.is(
      areaResistanceSquareMeterKelvinPerWatt,
      -0,
    )
      ? 0
      : areaResistanceSquareMeterKelvinPerWatt,
  };
};

export const example = {
  input: {
    firstThicknessMeters: 0.1,
    firstConductivityWattsPerMeterKelvin: 1,
    secondThicknessMeters: 0.2,
    secondConductivityWattsPerMeterKelvin: 2,
  },
  output: { areaResistanceSquareMeterKelvinPerWatt: 0.2 },
} satisfies ToolExample<
  CompositeWallThermalResistanceInput,
  CompositeWallThermalResistanceOutput
>;

export const tool = createSimpleTool({
  id: "engineering/composite-wall-thermal-resistance",
  title: "Composite Wall Thermal Resistance",
  description:
    "Area-normalized thermal resistance of two plane solid layers in series, d1/k1+d2/k2; excludes film resistances.",
  inputs: [
    {
      id: "firstThicknessMeters",
      kind: "number",
      label: "First Thickness Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "firstConductivityWattsPerMeterKelvin",
      kind: "number",
      label: "First Conductivity Watts Per Meter Kelvin",
      unit: "W/(m·K)",
      minimum: 0,
    },
    {
      id: "secondThicknessMeters",
      kind: "number",
      label: "Second Thickness Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "secondConductivityWattsPerMeterKelvin",
      kind: "number",
      label: "Second Conductivity Watts Per Meter Kelvin",
      unit: "W/(m·K)",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "areaResistanceSquareMeterKelvinPerWatt",
      kind: "number",
      label: "Area Resistance Square Meter Kelvin Per Watt",
      unit: "m²K/W",
    },
  ],
  calculate: (input) =>
    calculateCompositeWallThermalResistance({
      firstThicknessMeters: input.firstThicknessMeters as number,
      firstConductivityWattsPerMeterKelvin:
        input.firstConductivityWattsPerMeterKelvin as number,
      secondThicknessMeters: input.secondThicknessMeters as number,
      secondConductivityWattsPerMeterKelvin:
        input.secondConductivityWattsPerMeterKelvin as number,
    }),
});
export const compositeWallThermalResistanceTool = tool;
export const runCompositeWallThermalResistance = tool.execute;
export default tool;
