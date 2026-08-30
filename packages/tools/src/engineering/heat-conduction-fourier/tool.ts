import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeatConductionFourierInput = Readonly<{
  readonly conductivityWattsPerMeterKelvin: number;
  readonly areaSquareMeters: number;
  readonly thicknessMeters: number;
  readonly temperatureDifferenceKelvin: number;
}>;
export type HeatConductionFourierOutput = Readonly<{
  readonly heatWatts: number;
}>;

export const calculateHeatConductionFourier = (
  x: HeatConductionFourierInput,
): HeatConductionFourierOutput => {
  if (
    !Number.isFinite(x.conductivityWattsPerMeterKelvin) ||
    x.conductivityWattsPerMeterKelvin < 0
  )
    simpleError(
      "conductivityWattsPerMeterKelvin",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.thicknessMeters) || x.thicknessMeters < 0)
    simpleError("thicknessMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.temperatureDifferenceKelvin))
    simpleError("temperatureDifferenceKelvin", "Provide a finite number.");
  const heatWatts =
    (x.conductivityWattsPerMeterKelvin *
      x.areaSquareMeters *
      x.temperatureDifferenceKelvin) /
    x.thicknessMeters;
  if (!Number.isFinite(heatWatts))
    simpleError(
      "heatWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { heatWatts: Object.is(heatWatts, -0) ? 0 : heatWatts };
};

export const example = {
  input: {
    conductivityWattsPerMeterKelvin: 1,
    areaSquareMeters: 2,
    thicknessMeters: 0.1,
    temperatureDifferenceKelvin: 10,
  },
  output: { heatWatts: 200 },
} satisfies ToolExample<
  HeatConductionFourierInput,
  HeatConductionFourierOutput
>;

export const tool = createSimpleTool({
  id: "engineering/heat-conduction-fourier",
  title: "Heat Conduction Fourier",
  description:
    "Steady one-dimensional conductive heat-transfer rate through a plane layer from conductivity, area, thickness and temperature difference.",
  inputs: [
    {
      id: "conductivityWattsPerMeterKelvin",
      kind: "number",
      label: "Conductivity Watts Per Meter Kelvin",
      unit: "W/(m·K)",
      minimum: 0,
    },
    {
      id: "areaSquareMeters",
      kind: "number",
      label: "Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
    {
      id: "thicknessMeters",
      kind: "number",
      label: "Thickness Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "temperatureDifferenceKelvin",
      kind: "number",
      label: "Temperature Difference Kelvin",
      unit: "K",
    },
  ],
  outputs: [
    { id: "heatWatts", kind: "number", label: "Heat Watts", unit: "W" },
  ],
  calculate: (input) =>
    calculateHeatConductionFourier({
      conductivityWattsPerMeterKelvin:
        input.conductivityWattsPerMeterKelvin as number,
      areaSquareMeters: input.areaSquareMeters as number,
      thicknessMeters: input.thicknessMeters as number,
      temperatureDifferenceKelvin: input.temperatureDifferenceKelvin as number,
    }),
});
export const heatConductionFourierTool = tool;
export const runHeatConductionFourier = tool.execute;
export default tool;
