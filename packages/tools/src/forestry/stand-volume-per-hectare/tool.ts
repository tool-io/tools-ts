import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StandVolumePerHectareInput = Readonly<{
  readonly plotVolumeCubicMeters: number;
  readonly plotSquareMeters: number;
}>;
export type StandVolumePerHectareOutput = Readonly<{
  readonly cubicMetersPerHectare: number;
}>;

export const calculateStandVolumePerHectare = (
  x: StandVolumePerHectareInput,
): StandVolumePerHectareOutput => {
  if (!Number.isFinite(x.plotVolumeCubicMeters) || x.plotVolumeCubicMeters < 0)
    simpleError(
      "plotVolumeCubicMeters",
      "Provide a finite nonnegative number.",
    );
  if (!Number.isFinite(x.plotSquareMeters) || x.plotSquareMeters <= 0)
    simpleError("plotSquareMeters", "Provide a finite positive number.");
  const cubicMetersPerHectare =
    (10000 * x.plotVolumeCubicMeters) / x.plotSquareMeters;
  if (!Number.isFinite(cubicMetersPerHectare))
    simpleError(
      "cubicMetersPerHectare",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    cubicMetersPerHectare: Object.is(cubicMetersPerHectare, -0)
      ? 0
      : cubicMetersPerHectare,
  };
};

export const example = {
  input: {
    plotVolumeCubicMeters: 2,
    plotSquareMeters: 100,
  },
  output: { cubicMetersPerHectare: 200 },
} satisfies ToolExample<
  StandVolumePerHectareInput,
  StandVolumePerHectareOutput
>;

export const tool = createSimpleTool({
  id: "forestry/stand-volume-per-hectare",
  title: "Stand Volume Per Hectare",
  description:
    "Stand volume per hectare from measured total volume on a known plot area.",
  inputs: [
    {
      id: "plotVolumeCubicMeters",
      kind: "number",
      label: "Plot Volume Cubic Meters",
      unit: "m3",
      minimum: 0,
    },
    {
      id: "plotSquareMeters",
      kind: "number",
      label: "Plot Square Meters",
      unit: "m2",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "cubicMetersPerHectare",
      kind: "number",
      label: "Cubic Meters Per Hectare",
      unit: "m3/ha",
    },
  ],
  calculate: (input) =>
    calculateStandVolumePerHectare({
      plotVolumeCubicMeters: input.plotVolumeCubicMeters as number,
      plotSquareMeters: input.plotSquareMeters as number,
    }),
});
export const standVolumePerHectareTool = tool;
export const runStandVolumePerHectare = tool.execute;
export default tool;
