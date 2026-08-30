import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly absorbedPowerWatts: number;
  readonly beamAreaSquareMeters: number;
  readonly maximumPowerDensityWPerM2: number;
}>;
export type Output = Readonly<{
  readonly powerDensityWPerM2: number;
  readonly densityMarginWPerM2: number;
  readonly withinLimit: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.beamAreaSquareMeters <= 0)
    simpleError(
      "beamAreaSquareMeters",
      "Beam area must be positive.",
      "invalid_area",
    );
  const powerDensityWPerM2 =
    input.absorbedPowerWatts / input.beamAreaSquareMeters;
  return {
    powerDensityWPerM2,
    densityMarginWPerM2: input.maximumPowerDensityWPerM2 - powerDensityWPerM2,
    withinLimit: powerDensityWPerM2 <= input.maximumPowerDensityWPerM2,
  };
};

export const exampleInput = {
  absorbedPowerWatts: 100,
  beamAreaSquareMeters: 0.01,
  maximumPowerDensityWPerM2: 12000,
} satisfies Input;
export const exampleOutput = {
  powerDensityWPerM2: 10000,
  densityMarginWPerM2: 2000,
  withinLimit: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      absorbedPowerWatts: input.absorbedPowerWatts as number,
      beamAreaSquareMeters: input.beamAreaSquareMeters as number,
      maximumPowerDensityWPerM2: input.maximumPowerDensityWPerM2 as number,
    }),
  description:
    "Compare absorbed clear-air power density with a caller-supplied thermal-blooming limit.",
  id: "laser/thermal-blooming-threshold",
  inputs: [
    {
      id: "absorbedPowerWatts",
      label: "Absorbed beam power",
      kind: "number",
      minimum: 0,
      unit: "W",
    },
    {
      id: "beamAreaSquareMeters",
      label: "Beam area",
      kind: "number",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "maximumPowerDensityWPerM2",
      label: "Maximum clear-air power density",
      kind: "number",
      minimum: 0,
      unit: "W/m²",
    },
  ],
  outputs: [
    {
      id: "powerDensityWPerM2",
      label: "Power density",
      kind: "number",
      minimum: 0,
      unit: "W/m²",
    },
    {
      id: "densityMarginWPerM2",
      label: "Power-density margin",
      kind: "number",
      unit: "W/m²",
    },
    { id: "withinLimit", label: "Within limit", kind: "boolean" },
  ],
  title: "Thermal-Blooming Threshold",
});

export const run = tool.execute;
export default tool;
