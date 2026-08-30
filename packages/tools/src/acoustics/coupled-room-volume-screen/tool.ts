import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly openingAreaSquareMeters: number;
  readonly primaryVolumeCubicMeters: number;
  readonly secondaryVolumeCubicMeters: number;
  readonly minimumOpeningAreaPerVolume: number;
  readonly minimumSecondaryVolumeRatio: number;
}>;
export type Output = Readonly<{
  readonly openingAreaPerTotalVolume: number;
  readonly secondaryVolumeRatio: number;
  readonly meetsCallerThresholds: boolean;
}>;

export const calculate = (input: Input): Output => {
  const values = Object.entries(input);
  for (const [field, value] of values)
    if (!Number.isFinite(value) || value < 0)
      simpleError(
        field,
        "Value must be finite and nonnegative.",
        "invalid_value",
      );
  if (
    input.primaryVolumeCubicMeters <= 0 ||
    input.secondaryVolumeCubicMeters <= 0
  )
    simpleError(
      "primaryVolumeCubicMeters",
      "Both room volumes must be positive.",
      "invalid_volume",
    );
  const total =
    input.primaryVolumeCubicMeters + input.secondaryVolumeCubicMeters;
  if (!Number.isFinite(total))
    simpleError(
      "primaryVolumeCubicMeters",
      "Combined room volume is out of range.",
      "numeric_overflow",
    );
  const secondaryVolumeRatio = input.secondaryVolumeCubicMeters / total;
  const openingAreaPerTotalVolume = input.openingAreaSquareMeters / total;
  if (secondaryVolumeRatio <= 0)
    simpleError(
      "secondaryVolumeCubicMeters",
      "Volume ratio is too small to represent.",
      "numeric_underflow",
    );
  return {
    openingAreaPerTotalVolume,
    secondaryVolumeRatio,
    meetsCallerThresholds:
      secondaryVolumeRatio >= input.minimumSecondaryVolumeRatio &&
      openingAreaPerTotalVolume >= input.minimumOpeningAreaPerVolume,
  };
};

export const example = {
  input: {
    openingAreaSquareMeters: 10,
    primaryVolumeCubicMeters: 1000,
    secondaryVolumeCubicMeters: 250,
    minimumOpeningAreaPerVolume: 0.005,
    minimumSecondaryVolumeRatio: 0.15,
  },
  output: {
    openingAreaPerTotalVolume: 0.008,
    secondaryVolumeRatio: 0.2,
    meetsCallerThresholds: true,
  },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    openingAreaSquareMeters: 1,
    primaryVolumeCubicMeters: 1000,
    secondaryVolumeCubicMeters: 100,
    minimumOpeningAreaPerVolume: 0.005,
    minimumSecondaryVolumeRatio: 0.15,
  },
  output: {
    openingAreaPerTotalVolume: 0.0009090909090909091,
    secondaryVolumeRatio: 0.09090909090909091,
    meetsCallerThresholds: false,
  },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      openingAreaSquareMeters: input.openingAreaSquareMeters as number,
      primaryVolumeCubicMeters: input.primaryVolumeCubicMeters as number,
      secondaryVolumeCubicMeters: input.secondaryVolumeCubicMeters as number,
      minimumOpeningAreaPerVolume: input.minimumOpeningAreaPerVolume as number,
      minimumSecondaryVolumeRatio: input.minimumSecondaryVolumeRatio as number,
    }),
  description:
    "Screen caller-supplied coupled-volume and opening ratios against explicit project thresholds without claiming a universal coupled-room criterion.",
  id: "acoustics/coupled-room-volume-screen",
  inputs: [
    {
      id: "openingAreaSquareMeters",
      kind: "number",
      label: "Opening area",
      minimum: 0,
      unit: "m²",
    },
    {
      id: "primaryVolumeCubicMeters",
      kind: "number",
      label: "Primary volume",
      minimum: 0,
      unit: "m³",
    },
    {
      id: "secondaryVolumeCubicMeters",
      kind: "number",
      label: "Secondary volume",
      minimum: 0,
      unit: "m³",
    },
    {
      id: "minimumOpeningAreaPerVolume",
      kind: "number",
      label: "Minimum opening-area ratio",
      minimum: 0,
      unit: "m²/m³",
    },
    {
      id: "minimumSecondaryVolumeRatio",
      kind: "number",
      label: "Minimum secondary-volume ratio",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "openingAreaPerTotalVolume",
      kind: "number",
      label: "Opening area per total volume",
      minimum: 0,
      unit: "m²/m³",
    },
    {
      id: "secondaryVolumeRatio",
      kind: "number",
      label: "Secondary volume ratio",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "meetsCallerThresholds",
      kind: "boolean",
      label: "Meets caller thresholds",
    },
  ],
  title: "Coupled Room Volume Screen",
});

export const run = tool.execute;
export default tool;
