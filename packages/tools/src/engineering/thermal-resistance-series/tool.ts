import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ThermalResistanceSeriesInput = Readonly<{
  readonly firstKelvinPerWatt: number;
  readonly secondKelvinPerWatt: number;
}>;
export type ThermalResistanceSeriesOutput = Readonly<{
  readonly totalKelvinPerWatt: number;
}>;

export const calculateThermalResistanceSeries = (
  x: ThermalResistanceSeriesInput,
): ThermalResistanceSeriesOutput => {
  if (!Number.isFinite(x.firstKelvinPerWatt) || x.firstKelvinPerWatt < 0)
    simpleError("firstKelvinPerWatt", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.secondKelvinPerWatt) || x.secondKelvinPerWatt < 0)
    simpleError("secondKelvinPerWatt", "Provide a finite number at least 0.");
  const totalKelvinPerWatt = x.firstKelvinPerWatt + x.secondKelvinPerWatt;
  if (!Number.isFinite(totalKelvinPerWatt))
    simpleError(
      "totalKelvinPerWatt",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    totalKelvinPerWatt: Object.is(totalKelvinPerWatt, -0)
      ? 0
      : totalKelvinPerWatt,
  };
};

export const example = {
  input: { firstKelvinPerWatt: 1, secondKelvinPerWatt: 2 },
  output: { totalKelvinPerWatt: 3 },
} satisfies ToolExample<
  ThermalResistanceSeriesInput,
  ThermalResistanceSeriesOutput
>;

export const tool = createSimpleTool({
  id: "engineering/thermal-resistance-series",
  title: "Thermal Resistance Series",
  description:
    "Total thermal resistance of two one-dimensional heat-flow layers connected in series at the same heat rate.",
  inputs: [
    {
      id: "firstKelvinPerWatt",
      kind: "number",
      label: "First Kelvin Per Watt",
      unit: "K/W",
      minimum: 0,
    },
    {
      id: "secondKelvinPerWatt",
      kind: "number",
      label: "Second Kelvin Per Watt",
      unit: "K/W",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalKelvinPerWatt",
      kind: "number",
      label: "Total Kelvin Per Watt",
      unit: "K/W",
    },
  ],
  calculate: (input) =>
    calculateThermalResistanceSeries({
      firstKelvinPerWatt: input.firstKelvinPerWatt as number,
      secondKelvinPerWatt: input.secondKelvinPerWatt as number,
    }),
});
export const thermalResistanceSeriesTool = tool;
export const runThermalResistanceSeries = tool.execute;
export default tool;
