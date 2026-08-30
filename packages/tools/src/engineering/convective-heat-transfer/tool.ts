import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConvectiveHeatTransferInput = Readonly<{
  readonly coefficientWattsPerSquareMeterKelvin: number;
  readonly areaSquareMeters: number;
  readonly temperatureDifferenceKelvin: number;
}>;
export type ConvectiveHeatTransferOutput = Readonly<{
  readonly heatWatts: number;
}>;

export const calculateConvectiveHeatTransfer = (
  x: ConvectiveHeatTransferInput,
): ConvectiveHeatTransferOutput => {
  if (
    !Number.isFinite(x.coefficientWattsPerSquareMeterKelvin) ||
    x.coefficientWattsPerSquareMeterKelvin < 0
  )
    simpleError(
      "coefficientWattsPerSquareMeterKelvin",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.temperatureDifferenceKelvin))
    simpleError("temperatureDifferenceKelvin", "Provide a finite number.");
  const heatWatts =
    x.coefficientWattsPerSquareMeterKelvin *
    x.areaSquareMeters *
    x.temperatureDifferenceKelvin;
  if (!Number.isFinite(heatWatts))
    simpleError(
      "heatWatts",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { heatWatts: Object.is(heatWatts, -0) ? 0 : heatWatts };
};

export const example = {
  input: {
    coefficientWattsPerSquareMeterKelvin: 10,
    areaSquareMeters: 2,
    temperatureDifferenceKelvin: 20,
  },
  output: { heatWatts: 400 },
} satisfies ToolExample<
  ConvectiveHeatTransferInput,
  ConvectiveHeatTransferOutput
>;

export const tool = createSimpleTool({
  id: "engineering/convective-heat-transfer",
  title: "Convective Heat Transfer",
  description:
    "Newton-law convection heat-transfer rate hAΔT with a supplied convection coefficient at the stated flow condition.",
  inputs: [
    {
      id: "coefficientWattsPerSquareMeterKelvin",
      kind: "number",
      label: "Coefficient Watts Per Square Meter Kelvin",
      unit: "W/(m²·K)",
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
    calculateConvectiveHeatTransfer({
      coefficientWattsPerSquareMeterKelvin:
        input.coefficientWattsPerSquareMeterKelvin as number,
      areaSquareMeters: input.areaSquareMeters as number,
      temperatureDifferenceKelvin: input.temperatureDifferenceKelvin as number,
    }),
});
export const convectiveHeatTransferTool = tool;
export const runConvectiveHeatTransfer = tool.execute;
export default tool;
